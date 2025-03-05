"use client";

import { categorylist, getBrandsByProducts, getSubcategoryByProducts } from "@/service/instance";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
// Form Data Interface
interface FormData {
  productCategory: string;
  productid: string;
  plan: string;
  priceFrom: string;
  priceTo: string;
  dateFrom: Date | null;
  dateTo: Date | null;
  timeFrom: Date;
  timeTo: Date;
  discountAmount: string;
  discountPercent: string;
  brand: string;
  pincode: string;
  city: string;
  state: string;
  salesChannel: string;
}

// Brand Interface
interface Brand {
  Brand: string;
  SubCatgID: number;
  mid: number;
  imageUrl: string;
}

// Subcategory Interface
interface Subcategory {
  productid: string;
  productname: string;
  subcategoryid: string;
  subcategoryname: string;
}

// Add this interface near your other interfaces
interface SelectOption {
  value: string;
  label: string;
}

const FormComponent = () => {
  const [formData, setFormData] = useState<FormData>({
    productCategory: "",
    productid: "",
    plan: "",
    priceFrom: "",
    priceTo: "",
    dateFrom: null,
    dateTo: null,
    timeFrom: new Date(),
    timeTo: new Date(),
    discountAmount: "",
    discountPercent: "",
    brand: "",
    pincode: "",
    city: "",
    state: "",
    salesChannel: "",
  });

  const [categories, setCategories] = useState<{ subcategoryid: string; subcategoryname: string }[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  const plans = ["1 Year Extended Warranty", "2 Year Extended Warranty"];
  const salesChannels = ["Online", "Retail"];

  // Fetch Categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categorylist();
        if (Array.isArray(response)) {
          setCategories(response);
        } else {
          setCategories([]);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  // Fetch Subcategories when Product Category Changes
  useEffect(() => {
    if (!formData.productCategory) {
      setSubcategories([]);
      return;
    }

    const fetchSubcategories = async () => {
      try {
        const response = await getSubcategoryByProducts(formData.productCategory);
        if (Array.isArray(response)) {
          setSubcategories(response);
        } else {
          setSubcategories([]);
        }
      } catch (error) {
        console.error("Error fetching subcategories:", error);
        setSubcategories([]);
      }
    };

    fetchSubcategories();
  }, [formData.productCategory]);

  // Fetch Brands when Product ID Changes
  useEffect(() => {
    if (!formData.productid) {
      setBrands([]);
      return;
    }

    const fetchBrands = async () => {
      try {
        const response = await getBrandsByProducts(formData.productid);
        if (Array.isArray(response)) {
          setBrands(response);
        } else {
          setBrands([]);
        }
      } catch (error) {
        console.error("Error fetching brands:", error);
        setBrands([]);
      }
    };

    fetchBrands();
  }, [formData.productid]);

  // Handle Input Change
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === "productSubCategory") {
      setFormData({ 
        ...formData, 
        productid: value,  // Store the productid when subcategory is selected
        brand: ""  // Reset brand when subcategory changes
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    if (name === "productCategory") {
      setSubcategories([]); 
      setFormData(prev => ({ 
        ...prev, 
        productid: "",
        brand: "" 
      }));
    }
  };

  // Handle Date Changes
  const handleDateChange = (date: Date | null, field: string) => {
    setFormData({ ...formData, [field]: date });
  };

  // Handle Time Changes
  const handleTimeChange = (time: Date | null, field: string) => {
    setFormData({ ...formData, [field]: time });
  };

  // Check if Dates are Today
  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const areBothDatesToday = () => formData.dateFrom && formData.dateTo && isToday(formData.dateFrom) && isToday(formData.dateTo);
  const fetchBrands = async () => {
    if (!formData.productid) {
      setBrands([]);
      return;
    }
  
    try {
      const response = await getBrandsByProducts(formData.productid);
      if (Array.isArray(response)) {
        setBrands(response);
      } else {
        setBrands([]);
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
      setBrands([]);
    }
  };
  
  useEffect(() => {
    fetchBrands();
  }, [formData.productid]);
  
  const handleBrandSelect = (selectedOption: any) => {
    setFormData({ ...formData, brand: selectedOption?.value || "" });
  };
  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-gray-100 p-6">
      <div className="w-full max-w-6xl p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Promo Code Creation</h2>
        <form className="grid grid-cols-3 gap-6">
        <div>
      <label className="block">Product Category:</label>
      <select
        name="productCategory"
        onChange={handleChange}
        className="w-full p-2 border rounded"
      >
        <option value="">Select Category</option>
        {categories?.map((cat) => (
          <option key={cat.subcategoryid} value={cat.subcategoryid}>
            {cat.subcategoryname}
          </option>
        ))}
      </select>
    </div>
          <div>
            <label className="block">Product subCategory:</label>
            <select 
              name="productSubCategory" 
              value={formData.productid}  // Bind to productid in formData
              onChange={handleChange} 
              className="w-full p-2 border rounded"
            >
              <option value="">Select Subcategory</option>
              {subcategories?.map((subcat) => (
                <option key={subcat.productid} value={subcat.productid}>
                  {subcat.productname}
                </option>
              ))}
            </select>
          </div>
          <div>
  <label className="block">Brand:</label>
  <Select<SelectOption>
    instanceId="brand-select"
    options={brands.map((brand): SelectOption => ({
      value: brand.Brand,
      label: brand.Brand,
    }))}
    onChange={handleBrandSelect}
    value={formData.brand ? {
      value: formData.brand,
      label: formData.brand
    } : null}
    isClearable
    isSearchable
    placeholder="Search or select a brand"
    className="w-full"

  />
</div>

          <div>
            <label className="block">Plan:</label>
            <select name="plan" onChange={handleChange} className="w-full p-2 border rounded">
              <option value="">Select Plan</option>
              {plans.map((plan) => (
                <option key={plan} value={plan}>{plan}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block">Price From:</label>
            <input type="number" name="priceFrom" onChange={handleChange} className="w-full p-2 border rounded" />
          </div>

          <div>
            <label className="block">Price To:</label>
            <input type="number" name="priceTo" onChange={handleChange} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block">Date From:</label>
            <DatePicker
              selected={formData.dateFrom}
              onChange={(date) => handleDateChange(date, 'dateFrom')}
              className="w-full p-2 border rounded"
              dateFormat="dd/MM/yyyy"
              placeholderText="Select start date"
            />
          </div>
          
          <div>
            <label className="block">Date To:</label>
            <DatePicker
              selected={formData.dateTo}
              onChange={(date) => handleDateChange(date, 'dateTo')}
              className="w-full p-2 border rounded"
              dateFormat="dd/MM/yyyy"
              placeholderText="Select end date"
              minDate={formData.dateFrom || undefined}
            />
          </div>

          {/* Show time fields only when both dates are today */}
          {areBothDatesToday() && (
            <>
              <div>
                <label className="block">Time From:</label>
                <DatePicker
                  selected={formData.timeFrom}
                  onChange={(time) => handleTimeChange(time, 'timeFrom')}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="Time"
                  dateFormat="h:mm aa"
                  className="w-full p-2 border rounded"
                  placeholderText="Select start time"
                />
              </div>

              <div>
                <label className="block">Time To:</label>
                <DatePicker
                  selected={formData.timeTo}
                  onChange={(time) => handleTimeChange(time, 'timeTo')}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="Time"
                  dateFormat="h:mm aa"
                  className="w-full p-2 border rounded"
                  placeholderText="Select end time"
                  minTime={formData.timeFrom}
                  maxTime={new Date(new Date().setHours(23, 59))}
                />
              </div>
            </>
          )}

          <div>
            <label className="block">Discount Amount:</label>
            <input type="number" name="discountAmount" onChange={handleChange} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block">Discount Percent:</label>
            <input type="number" name="discountPercent" onChange={handleChange} className="w-full p-2 border rounded" />
          </div>
        

          <div>
            <label className="block">Pincode:</label>
            <input type="text" name="pincode" onChange={handleChange} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block">City:</label>
            <input type="text" name="city" onChange={handleChange} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block">State:</label>
            <input type="text" name="state" onChange={handleChange} className="w-full p-2 border rounded" />
          </div>

          <div className="col-span-3">
            <label className="block">Sales Channel:</label>
            <select name="salesChannel" onChange={handleChange} className="w-full p-2 border rounded">
              <option value="">Select Channel</option>
              {salesChannels.map((channel) => (
                <option key={channel} value={channel}>{channel}</option>
              ))}
            </select>
          </div>

          <div className="col-span-3 flex justify-center">
            <button type="submit" className="w-full max-w-xs mt-4 p-3 bg-blue-500 text-white rounded">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormComponent;
