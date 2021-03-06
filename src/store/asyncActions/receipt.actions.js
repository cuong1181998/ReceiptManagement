/* eslint-disable import/prefer-default-export */
import moment from 'moment';
import {
  getListReceiptSuccess,
  getDetailReceiptSuccess,
  editReceiptSuccess,
  createReceiptSuccess,
  uploadDataSuccess
} from '../reducers/receipts.reducer';
import { setError, setLoading, setMessage } from '../reducers/ui.reducer';
import axiosInstance from '../../axiosInstance';
import routeEnum from '../../axiosInstance/apiRoute';
import dateUtils from '../../utils/dateUtils';

const MAX_NAME_LENGTH = 50;

export const fetchListReceipts = (
  params
) => async (dispatch) => {
  try {
    const query = {
      toDate: dateUtils.isoEndOfMonth(),
      fromDate: dateUtils.isoStartOfMonth(),
      ...params
    };
    dispatch(setLoading(true));
    const receipts = await axiosInstance.get(routeEnum.RECEIPTS, { params: query });
    dispatch(setLoading(false));
    dispatch(getListReceiptSuccess(receipts));
  } catch (error) {
    dispatch(setLoading(false));
    dispatch(setError('Get list receipts fail'));
  }
};

export const getDetailReceipt = (
  id
) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const receipt = await axiosInstance.get(`${routeEnum.RECEIPTS}${id}`);
    dispatch(setLoading(false));
    dispatch(getDetailReceiptSuccess(receipt));
  } catch (error) {
    dispatch(setLoading(false));
    dispatch(setError('Get receipt detail fail'));
  }
};

export const createReceipt = (
  params
) => async (dispatch) => {
  try {
    const query = {
      purchaseDate: moment(params.purchaseDate, 'DD-MM-YYYY').toISOString(),
      merchant: params.merchant,
      category_id: params.category_id,
      total: Number(params.total),
      products: params.products.map((o) => ({
        name: o.name.slice(0, MAX_NAME_LENGTH),
        price: Number(o.price)
      })),
      url_image: params.url_image || ''
    };
    dispatch(setLoading(true));
    const receipt = await axiosInstance.post(routeEnum.RECEIPTS, query);
    dispatch(setLoading(false));
    dispatch(createReceiptSuccess(receipt));
    dispatch(setMessage('Success'));
    dispatch(fetchListReceipts());
  } catch (error) {
    dispatch(setLoading(false));
    dispatch(setError('Create receipt fail'));
  }
};

export const createReceiptOCR = (
  formData,
  callback
) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  };
  try {
    dispatch(setLoading(true));
    const receipt = await axiosInstance.post(`${routeEnum.RECEIPTS}upload`, formData, config);
    dispatch(setLoading(false));
    dispatch(uploadDataSuccess(receipt));
    dispatch(setMessage('Success'));
    if (callback) {
      callback();
    }
  } catch (error) {
    dispatch(setLoading(false));
    dispatch(setError('Create receipt fail'));
  }
};

export const editReceipt = (
  params
) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const query = {
      id: params.id,
      purchaseDate: moment(params.purchaseDate, 'DD-MM-YYYY').toISOString(),
      merchant: params.merchant,
      category_id: params.category_id,
      total: Number(params.total),
      products: params.products.map((o) => ({ name: o.name, price: Number(o.price) })),
      url_image: params.url_image || ''
    };
    const receipt = await axiosInstance.put(`${routeEnum.RECEIPTS}${query.id}`, query);
    dispatch(setLoading(false));
    dispatch(editReceiptSuccess(receipt));
    dispatch(setMessage('Success'));
    dispatch(fetchListReceipts());
  } catch (error) {
    dispatch(setLoading(false));
    dispatch(setError('Edit receipt fail'));
  }
};

export const deleteReceipt = (
  id
) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    await axiosInstance.delete(`${routeEnum.RECEIPTS}${id}`);
    dispatch(setLoading(false));
    dispatch(setMessage('Success'));
    dispatch(fetchListReceipts());
  } catch (error) {
    dispatch(setLoading(false));
    dispatch(setError('Edit receipt fail'));
  }
};
