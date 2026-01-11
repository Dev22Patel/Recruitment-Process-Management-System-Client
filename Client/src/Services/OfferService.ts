import axios from 'axios';
import type { Offer, CreateOfferDto, UpdateOfferStatusDto } from '@/Types/offer.type';

const API_URL = 'https://localhost:7057/api';

export const offerService = {
  async createOffer(dto: CreateOfferDto): Promise<Offer> {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/offer`, dto, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async updateOfferStatus(dto: UpdateOfferStatusDto): Promise<Offer> {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/offer/status`, dto, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async getAllOffers(): Promise<Offer[]> {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/offer`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async getPendingOffers(): Promise<Offer[]> {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/offer/pending`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async getOfferById(id: string): Promise<Offer> {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/offer/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async getOfferByApplicationId(applicationId: string): Promise<Offer> {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/offer/application/${applicationId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },
};