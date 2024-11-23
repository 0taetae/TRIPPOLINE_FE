// stores/spotStore.js
import { defineStore } from 'pinia';
import api from "@/Auth/api/AuthIndex";

export const useSpotStore = defineStore('spot', {
  state: () => ({
    sidos: [],
    sigungus: [],
    spotTypes: [],
    spots: [],
    selectedSido: null,
    selectedSigungu: null,
    selectedSpotType: null,
  }),

  actions: {
    async fetchSidos() {
      try {
        console.log('Fetching sidos from:', api.defaults.baseURL + '/spot/sidos');
        const response = await api.get('/spot/sidos');
        this.sidos = response.data;
        return this.sidos;
      } catch (error) {
        console.error('시도 목록 조회 실패:', error);
        throw error;
      }
    },

    async fetchSigungus(sidoCode) {
      try {
        console.log('Fetching sigungus for sidoCode:', sidoCode);
        const response = await api.get(`/spot/sigungus/${sidoCode}`);
        this.sigungus = response.data;
        return this.sigungus;
      } catch (error) {
        console.error('시군구 목록 조회 실패:', error);
        throw error;
      }
    },

    async fetchSpotTypes() {
      try {
        console.log('Fetching spot types');
        const response = await api.get('/spot/contenttypes');
        this.spotTypes = response.data;
        return this.spotTypes;
      } catch (error) {
        console.error('관광지 유형 조회 실패:', error);
        throw error;
      }
    },

    async searchSpots({ areaCode, siGunGuCode, contentTypeId, keyword }) {
      try {
        console.log('Searching spots with params:', { areaCode, siGunGuCode, contentTypeId, keyword });
        const response = await api.post('/spot/search', {
          areaCode,
          siGunGuCode: siGunGuCode || null,
          contentTypeId: contentTypeId || null,
          keyword: keyword || null
        });

        this.spots = response.data;
        console.log('Search results:', this.spots);
        return this.spots;
      } catch (error) {
        console.error('검색 실패:', error);
        this.spots = [];
        throw error;
      }
    }
  }
});
