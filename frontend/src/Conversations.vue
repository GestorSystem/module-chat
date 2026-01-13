<template>
  <q-page class="conversations-page">
    <PageHeader
      :title="'Conversas'"
      :icon="'chat'"
      :show-search="true"
      @search="handleSearch"
    >
      <template #left-actions>
        <q-btn
          flat
          round
          dense
          icon="arrow_back"
          @click="$router.push('/')"
          class="q-mr-sm"
        />
      </template>
    </PageHeader>

    <div class="q-pa-md">
      <!-- Lista de conversas em formato de cards -->
      <div v-if="loading" class="flex flex-center q-pa-lg">
        <q-spinner color="primary" size="3em" />
      </div>

      <div v-else-if="conversations.length === 0" class="flex flex-center q-pa-lg">
        <q-card flat class="text-center" style="max-width: 400px">
          <q-card-section>
            <q-icon name="chat_bubble_outline" size="64px" color="grey-5" />
            <div class="text-h6 q-mt-md text-grey-6">Nenhuma conversa encontrada</div>
            <div class="text-body2 text-grey-5 q-mt-sm">
              Comece uma nova conversa clicando no botão abaixo
            </div>
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              color="primary"
              label="Nova Conversa"
              icon="add"
              @click="createNewConversation"
            />
          </q-card-actions>
        </q-card>
      </div>

      <div v-else class="row q-gutter-md">
        <div
          v-for="conversation in conversations"
          :key="conversation.id"
          class="col-12 col-sm-6 col-md-4 col-lg-3"
        >
          <q-card
            class="conversation-card cursor-pointer"
            @click="openConversation(conversation.id)"
            :class="{ 'conversation-card-active': selectedConversationId === conversation.id }"
          >
            <q-card-section>
              <div class="row items-center q-mb-sm">
                <q-avatar
                  :color="getAvatarColor(conversation.Pessoa?.nome)"
                  text-color="white"
                  size="48px"
                  class="q-mr-sm"
                >
                  {{ getInitials(conversation.Pessoa?.nome || 'N/A') }}
                </q-avatar>
                <div class="col">
                  <div class="text-h6 text-weight-medium">
                    {{ conversation.Pessoa?.nome || 'Sem pessoa' }}
                  </div>
                  <div class="text-caption text-grey-6">
                    {{ conversation.Pessoa?.email || '-' }}
                  </div>
                </div>
              </div>
            </q-card-section>

            <q-separator />

            <q-card-section class="q-pt-sm">
              <div class="row q-gutter-xs q-mb-xs">
                <q-chip
                  v-if="conversation.Channels"
                  size="sm"
                  color="primary"
                  text-color="white"
                  icon="tag"
                >
                  {{ conversation.Channels.name }}
                </q-chip>
                <q-chip
                  v-if="conversation.User"
                  size="sm"
                  color="secondary"
                  text-color="white"
                  icon="person"
                >
                  {{ conversation.User.name }}
                </q-chip>
              </div>
              <div class="text-caption text-grey-6">
                Criado em: {{ formatDate(conversation.createdAt) }}
              </div>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn
                flat
                dense
                icon="visibility"
                label="Ver"
                color="primary"
                @click.stop="openConversation(conversation.id)"
              />
              <q-btn
                flat
                dense
                icon="edit"
                label="Editar"
                color="secondary"
                @click.stop="editConversation(conversation.id)"
              />
            </q-card-actions>
          </q-card>
        </div>
      </div>

      <!-- Paginação -->
      <div v-if="totalPages > 1" class="row justify-center q-mt-md">
        <q-pagination
          v-model="currentPage"
          :max="totalPages"
          :max-pages="7"
          direction-links
          boundary-links
          @update:model-value="loadConversations"
        />
      </div>

      <!-- Botão FAB para nova conversa -->
      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn
          fab
          icon="add"
          color="primary"
          @click="createNewConversation"
        >
          <q-tooltip>Nova Conversa</q-tooltip>
        </q-btn>
      </q-page-sticky>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useQuasar } from 'quasar';
// Importar do módulo system usando caminho relativo
// O componente está em mod/chat/frontend/src/Conversations.vue
// O módulo system está em mod/system/frontend/src/
// Caminho: ../ (sai de src) -> ../ (sai de frontend) -> ../ (sai de chat) -> system/frontend/src/
import { api } from '../../../system/frontend/src/boot/axios';
import PageHeader from '../../../system/frontend/src/components/PageHeader.vue';

const router = useRouter();
const route = useRoute();
const $q = useQuasar();

const conversations = ref([]);
const loading = ref(false);
const searchQuery = ref('');
const currentPage = ref(1);
const limit = ref(12);
const totalPages = ref(1);
const totalCount = ref(0);
const selectedConversationId = ref(null);

// Obter iniciais do nome para avatar
function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

// Gerar cor do avatar baseado no nome
function getAvatarColor(name) {
  if (!name) return 'grey';
  const colors = ['primary', 'secondary', 'accent', 'positive', 'negative', 'info', 'warning'];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

// Formatar data
function formatDate(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Carregar conversas
async function loadConversations() {
  loading.value = true;
  try {
    const params = {
      page: currentPage.value,
      limit: limit.value,
      include: 'Pessoa,Channels,User'
    };

    if (searchQuery.value) {
      params.search = searchQuery.value;
    }

    const response = await api.get('/api/conversations', { params });
    
    if (response.data) {
      conversations.value = response.data.data || response.data.rows || response.data;
      totalCount.value = response.data.count || response.data.total || 0;
      totalPages.value = response.data.totalPages || Math.ceil(totalCount.value / limit.value);
    }
  } catch (error) {
    console.error('Erro ao carregar conversas:', error);
    $q.notify({
      color: 'negative',
      message: 'Erro ao carregar conversas',
      icon: 'error'
    });
  } finally {
    loading.value = false;
  }
}

// Buscar conversas
function handleSearch(query) {
  searchQuery.value = query;
  currentPage.value = 1;
  loadConversations();
}

// Abrir conversa
function openConversation(id) {
  selectedConversationId.value = id;
  router.push(`/conversations/${id}`);
}

// Editar conversa
function editConversation(id) {
  router.push(`/crud/conversations/${id}`);
}

// Criar nova conversa
function createNewConversation() {
  router.push('/crud/conversations/new');
}

onMounted(() => {
  loadConversations();
  
  // Verificar se há ID na rota para selecionar
  if (route.params.id) {
    selectedConversationId.value = parseInt(route.params.id);
  }
});
</script>

<style scoped>
.conversations-page {
  background-color: #f5f5f5;
}

.conversation-card {
  transition: transform 0.2s, box-shadow 0.2s;
  height: 100%;
}

.conversation-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.conversation-card-active {
  border: 2px solid var(--q-primary);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>

