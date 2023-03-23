import { OperationItem, OrdersWithPagination, ProductItem } from './../../storage/orderView';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OrderItem } from '../../storage/orderView';
import { OrderListByCustomer } from '../../storage/orderViewCustomer';
import { RootState } from '../../store';
import { getOrderData, getOrdersId } from './previewOrdersAPI';
import { parseOrderData, parseOrdersData } from './previewOrdersHelper';

interface PreviewOrders {
  orderData: OrderItem | null;
  selectProductData: ProductItem | undefined;
  selectOperationData: OperationItem | undefined;
  isLoadingPreviewList: boolean;
  isLoadingCurrentOrder: boolean;
  errorOfList: boolean;
  errorOfCurrentOrder: boolean;
  previewOrdersList: OrdersWithPagination | null;
}

const initialState: PreviewOrders = {
  orderData: null,
  selectProductData: undefined,
  selectOperationData: undefined,
  isLoadingPreviewList: false,
  isLoadingCurrentOrder: false,
  errorOfList: false,
  errorOfCurrentOrder: false,
  previewOrdersList: null,
};

export const getOrderAsync = createAsyncThunk(
  'getOrderData',
  async (data: { token: string; hostname: string; currentOrder: string }) => {
    const response = await getOrderData(data.hostname, data.token, data.currentOrder);

    if (response.data) {
      return parseOrdersData(response.data[0]);
    }
    return null;
  }
);

export const getOrdersIdAsync = createAsyncThunk(
  'getOrdersId',
  async (data: { token: string; hostname: string }) => {
    const response = await getOrdersId(data.hostname, data.token);
    if (response.data) {
      const orderData = response.data.results.map((item: OrderListByCustomer) => {
        return parseOrderData(item);
      });
      console.log('', { ...response.data, results: orderData });

      return { ...response.data, results: orderData };
    }
    return [];
  }
);

const previewOrdersPage = createSlice({
  name: 'previewOrders',
  initialState,
  reducers: {
    setIsError: (state, action) => {
      state.errorOfCurrentOrder = action.payload;
    },
    setSelectOperationData(state, action: PayloadAction<OperationItem>) {
      state.selectOperationData = action.payload;
    },
    setSelectProductData(state, action: PayloadAction<ProductItem>) {
      state.selectProductData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getOrderAsync.pending, (state) => {
      state.isLoadingCurrentOrder = true;
    });
    builder.addCase(getOrderAsync.fulfilled, (state, action) => {
      state.isLoadingCurrentOrder = false;
      state.orderData = action.payload;
    });
    builder.addCase(getOrderAsync.rejected, (state) => {
      state.isLoadingCurrentOrder = false;
      state.errorOfCurrentOrder = true;
    });
    builder.addCase(getOrdersIdAsync.pending, (state) => {
      state.isLoadingPreviewList = true;
    });
    builder.addCase(
      getOrdersIdAsync.fulfilled,
      (state, action: PayloadAction<OrdersWithPagination>) => {
        state.isLoadingPreviewList = false;
        state.previewOrdersList = action.payload;
      }
    );
    builder.addCase(getOrdersIdAsync.rejected, (state) => {
      state.isLoadingPreviewList = false;
      state.errorOfList = true;
    });
  },
});

export const { setIsError, setSelectOperationData, setSelectProductData } =
  previewOrdersPage.actions;
export const selectPreviewOrders = (state: RootState) => state.previewOrders;
export default previewOrdersPage.reducer;
