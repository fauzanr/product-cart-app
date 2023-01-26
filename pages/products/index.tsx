import { ProductRecord, ResponsePagination } from "@/types";
import { Table } from "@geist-ui/core";
import { useState } from "react";
import useSWR from "swr";
import CustomPagination from "../components/customPagination";

export default function ProductsPage() {
  const [pagination, setPagination] = useState({
    total: 0,
    skip: 0,
    limit: 15,
  });

  const { data, isLoading, error } = useSWR<
    ResponsePagination<{
      products: ProductRecord[];
    }>
  >(
    `https://dummyjson.com/products?skip=${pagination.skip}&limit=${pagination.limit}`,
    {
      onSuccess(data) {
        const { total, skip } = data;
        setPagination((prev) => ({ ...prev, total, skip }));
      },
    }
  );

  return (
    <div style={{ padding: "1rem" }}>
      <Table data={data?.products} emptyText="No data">
        <Table.Column prop="title" label="Product Name" />
        <Table.Column prop="brand" label="Brand" />
        <Table.Column prop="price" label="Price" />
        <Table.Column prop="stock" label="Stock" />
        <Table.Column prop="category" label="Category" />
      </Table>

      <CustomPagination pagination={pagination} onChange={setPagination} />
    </div>
  );
}
