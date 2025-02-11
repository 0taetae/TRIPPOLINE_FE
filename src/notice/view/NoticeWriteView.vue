<!-- src/views/NoticeWriteView.vue -->
<template>
  <div class="min-h-screen bg-gray-50 p-4">
    <div class="max-w-3xl mx-auto">
      <!-- 헤더 영역 -->
      <div class="bg-white shadow-sm rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
        <h2 class="text-2xl sm:text-3xl font-bold text-gray-800">
          {{ isModify ? '공지사항 수정' : '공지사항 글쓰기' }}
        </h2>
      </div>

      <!-- 폼 영역 -->
      <div class="bg-white shadow-sm rounded-lg overflow-hidden">
        <form @submit.prevent="submitNotice" class="p-4 sm:p-6">
          <div class="mb-4 sm:mb-6">
            <label for="title" class="block text-sm font-medium text-gray-700 mb-2">제목</label>
            <input 
              v-model="title" 
              type="text" 
              id="title" 
              required
              placeholder="제목을 입력하세요"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
          </div>
          
          <div class="mb-4 sm:mb-6">
            <label for="contents" class="block text-sm font-medium text-gray-700 mb-2">내용</label>
            <textarea 
              v-model="contents" 
              id="contents" 
              rows="15" 
              required
              placeholder="내용을 입력하세요"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            ></textarea>
          </div>

          <div class="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
            <button 
              type="button"
              @click="router.push({ name: 'NoticeList' })"
              class="w-full sm:w-auto px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              취소
            </button>
            <button 
              type="submit"
              class="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              {{ isModify ? '수정' : '등록' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useNoticeStore } from "@/notice/noticeStore";

const router = useRouter();
const route = useRoute();
const noticeStore = useNoticeStore();

const title = ref('');
const contents = ref('');

const isModify = computed(() => !!route.params.noticeNo);

onMounted(async () => {
  if (isModify.value) {
    try {
      const notice = await noticeStore.fetchNotice(route.params.noticeNo);
      title.value = notice.title;
      contents.value = notice.contents;
    } catch (error) {
      console.error('공지사항 로드 실패:', error);
      alert('공지사항을 불러오는데 실패했습니다.');
      router.push({ name: 'NoticeList' });
    }
  }
});

const submitNotice = async () => {
  try {
    if (isModify.value) {
      await noticeStore.modifyNotice({
        noticeNo: parseInt(route.params.noticeNo),
        title: title.value,
        contents: contents.value,
        userId: 'admin'
      });
      alert('공지사항이 수정되었습니다.');
    } else {
      await noticeStore.writeNotice({
        title: title.value,
        contents: contents.value,
        userId: 'admin'
      });
      alert('공지사항이 작성되었습니다.');
    }
    router.push({ name: 'NoticeList' });
  } catch (error) {
    console.error('공지사항 저장 실패:', error);
    alert(isModify.value ? '수정 중 오류가 발생했습니다.' : '작성 중 오류가 발생했습니다.');
  }
};
</script>