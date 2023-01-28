import CustomPagination from "@/components/customPagination";
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
import { Filter } from "@geist-ui/icons";
import { useMemo, useState } from "react";
import useSWR from "swr";

const ActionContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
  gap: 0.5rem;
`;

export default function ProductsPage() {
  const { setToast } = useToasts();
  const [drawerVisible, setDrawerVisible] = useState(false);
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

    return data.products.filter((product) =>
      product.title.toLowerCase().includes(keyword.toLocaleLowerCase())
    );
  }, [keyword, data]);

  return (
    <div style={{ padding: "1rem" }}>
      <Text h1 py={1}>
        Products
      </Text>

      <ActionContainer>
        <Button
          iconRight={<Filter />}
          h={0.9}
          ghost
          auto
          onClick={() => setDrawerVisible(true)}
        >
          Filter
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
    </div>
  );
}
