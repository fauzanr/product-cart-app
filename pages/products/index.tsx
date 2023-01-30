import CustomPagination from "@/components/customPagination";
import ProductFilter from "@/components/productFilter";
import Spin from "@/components/spin";
import { PRODUCTS_URL } from "@/endpoints";
import { ProductFilters, ProductRecord, ResponsePagination } from "@/types";
import { Table, Text, useToasts } from "@geist-ui/core";
import { useMemo, useState } from "react";
import useSWR from "swr";

export default function ProductsPage() {
  const { setToast } = useToasts();
  const [filters, setFilters] = useState<ProductFilters>();
  const [pagination, setPagination] = useState({
    total: 0,
    skip: 0,
    limit: 15,
  });

  const { data, isLoading } = useSWR<
    ResponsePagination<{
      products: ProductRecord[];
    }>
  >(`${PRODUCTS_URL}?skip=${pagination.skip}&limit=${pagination.limit}`, {
    onSuccess(data) {
      const { total, skip } = data;
      setPagination((prev) => ({ ...prev, total, skip }));
    },
    onError() {
      setToast({ text: "Error fetching products", type: "error" });
    },
  });

  const filteredProducts = useMemo(() => {
    if (!data?.products) return [];
    if (!filters) return data.products;

    return data.products.filter((product) => {
      const matchKeyword = product.title
        .toLowerCase()
        .includes(filters.keyword.toLocaleLowerCase());
      const matchCategory = filters.categories.length
        ? filters.categories.includes(product.category)
        : true;
      const matchBrand = filters.brands.length
        ? filters.brands.includes(product.brand)
        : true;
      const matchPriceRange =
        product.price >= filters.minPrice && product.price <= filters.maxPrice;

      return matchKeyword && matchCategory && matchBrand && matchPriceRange;
    });
  }, [data, filters]);

  return (
    <div style={{ padding: "1rem" }}>
      <Text h1 py={1}>
        Products
      </Text>

      <ProductFilter onChange={(filters) => setFilters(filters)} />

      <Spin loading={isLoading}>
        <div style={{ overflowX: "auto", minHeight: 200 }}>
          <Table data={filteredProducts} emptyText="No data">
            <Table.Column prop="title" label="Product Name" />
            <Table.Column prop="brand" label="Brand" />
            <Table.Column prop="price" label="Price" />
            <Table.Column prop="stock" label="Stock" />
            <Table.Column prop="category" label="Category" />
          </Table>
        </div>
      </Spin>

      <CustomPagination pagination={pagination} onChange={setPagination} />
    </div>
  );
}
