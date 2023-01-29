import CustomPagination from "@/components/customPagination";
import { useProductFilter } from "@/components/productFilter";
import Spin from "@/components/spin";
import { PRODUCTS_URL } from "@/endpoints";
import { ProductRecord, ResponsePagination } from "@/types";
import styled from "@emotion/styled";
import {
  Button,
  Input,
  Table,
  Text,
  useInput,
  useToasts,
} from "@geist-ui/core";
import { Filter, X } from "@geist-ui/icons";
import { useMemo, useState } from "react";
import useSWR from "swr";

const ActionContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  margin-bottom: 1rem;
  gap: 0.5rem;
`;

export default function ProductsPage() {
  const { setToast } = useToasts();
  const {
    filters,
    Component: ProductFilter,
    appliedFilters,
    openFilter,
    clearFilters,
  } = useProductFilter();
  const { state: keyword, bindings } = useInput("");
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
    if (appliedFilters === 0) return data.products;

    return data.products.filter((product) => {
      const matchKeyword = product.title
        .toLowerCase()
        .includes(keyword.toLocaleLowerCase());
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
  }, [keyword, data, filters]);

  return (
    <div style={{ padding: "1rem" }}>
      <Text h1 py={1}>
        Products
      </Text>

      <ActionContainer>
        {appliedFilters > 0 && (
          <Button
            iconRight={<X />}
            type="abort"
            h={0.9}
            auto
            onClick={clearFilters}
          >
            Clear Filters
          </Button>
        )}
        <Button
          iconRight={<Filter />}
          h={0.9}
          type={appliedFilters ? "success" : "default"}
          ghost
          auto
          onClick={() => openFilter()}
        >
          Filter {appliedFilters > 0 && `(${appliedFilters})`}
        </Button>
        <Input placeholder="Search Product" clearable {...bindings} />
      </ActionContainer>

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

      {ProductFilter}
    </div>
  );
}
