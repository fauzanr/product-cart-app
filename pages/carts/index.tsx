import CustomPagination from "@/components/customPagination";
import Spin from "@/components/spin";
import { CARTS_URL } from "@/endpoints";
import { CartRecord, ResponsePagination } from "@/types";
import styled from "@emotion/styled";
import { Button, Table, useToasts } from "@geist-ui/core";
import { Filter } from "@geist-ui/icons";
import { useState } from "react";
import useSWR from "swr";

const ActionContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
  gap: 0.5rem;
`;

export default function CartsPage() {
  const { setToast } = useToasts();
  const [pagination, setPagination] = useState({
    total: 0,
    skip: 0,
    limit: 15,
  });

  const { data, isLoading } = useSWR<
    ResponsePagination<{
      carts: CartRecord[];
    }>
  >(`${CARTS_URL}?skip=${pagination.skip}&limit=${pagination.limit}`, {
    onSuccess(data) {
      const { total, skip } = data;
      setPagination((prev) => ({ ...prev, total, skip }));
    },
    onError() {
      setToast({ text: "Error fetching carts", type: "error" });
    },
  });

  return (
    <div style={{ padding: "1rem" }}>
      <ActionContainer>
        <Button iconRight={<Filter />} h={0.9} ghost auto>
          Filter
        </Button>
      </ActionContainer>

      <Spin loading={isLoading}>
        <Table data={data?.carts} emptyText="No data">
          <Table.Column prop="userId" label="User ID" />
          <Table.Column prop="totalProducts" label="Total Products" />
          <Table.Column prop="totalQuantity" label="Total Quantity" />
          <Table.Column prop="total" label="Stock" />
        </Table>
      </Spin>

      <CustomPagination pagination={pagination} onChange={setPagination} />
    </div>
  );
}