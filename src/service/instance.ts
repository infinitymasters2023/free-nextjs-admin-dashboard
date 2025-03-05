import axios, {
	AxiosError,
	AxiosRequestConfig,
	AxiosResponse,
	InternalAxiosRequestConfig,
} from "axios";
import Cookies from "js-cookie";
const accessToken = Cookies.get("accessToken");

const ApiAxios = axios.create({
	
 	 baseURL: "http://localhost:4600/",
	// baseURL: "https://infyshieldapi.infyshield.com/",
	timeout: 8000,
});

ApiAxios.interceptors.request.use(
	(request: InternalAxiosRequestConfig) => {
		request.headers.Authorization = `Bearer ${accessToken}`;
		return request;
	},
	(error: AxiosError) => {
		return Promise.reject(error);
	}
);

ApiAxios.interceptors.response.use(
	(response: AxiosResponse) => {
		return response;
	},
	(error: AxiosError) => {
		return Promise.reject(error);
	}
);

export const get = async (url: string, config?: AxiosRequestConfig) => {
	try {
		const response = await ApiAxios.get(url, config);
		return response.data;
	} catch (error) {
		throw error;
	}
};

export const post = async (
	url: string,
	data?: any,
	config?: AxiosRequestConfig
) => {
	try {
		const response = await ApiAxios.post(url, data, config);
		return response.data;
	} catch (error) {
		throw error;
	}
};

export const patch = async (
	url: string,
	data?: any,
	config?: AxiosRequestConfig
) => {
	try {
		const response = await ApiAxios.patch(url, data, config);
		return response.data;
	} catch (error) {
		throw error;
	}
};

export const put = async (
	url: string,
	data?: any,
	config?: AxiosRequestConfig
) => {
	try {
		const response = await ApiAxios.put(url, data, config);
		return response.data;
	} catch (error) {
		throw error;
	}
};

export const del = async (
	url: string,
	data?: any,
	config?: AxiosRequestConfig
) => {
	try {
		const response = await ApiAxios.delete(url, { ...config, data });
		return response.data;
	} catch (error) {
		throw error;
	}
};


export const categorylist = async (): Promise<any> => {
    return await get('/master/category');
};
 

export const getSubcategoryByProducts = async (subcategoryid : any): Promise<any> => {
    return await get(`master/subcategory/${subcategoryid}`);
};

export const getBrandsByProducts = async (subCatgID : any): Promise<any> => {
    return await get(`/master/brands/${subCatgID}`);
};
export const getPincodeInfo = async (pincode: string): Promise<any> => {
    return await get(`master/pincode/${pincode}`)
};
export const getServicePlanOptions = async (iData: any): Promise<any> => {
    return await post('/policy/service-plan-options',iData);
}
export const getBlockEmails = async (): Promise<any> => {
    return await get('/emailblocker');
};

export const getinsertPromocodedata = async (iData: any): Promise<any> => {
    return await post('/master/onlinesale',iData);
}
