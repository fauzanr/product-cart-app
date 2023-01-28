import { CARTS_URL } from "@/endpoints";
import { CartRecord } from "@/types";
import styled from "@emotion/styled";
import { Description, Note, Table, Text } from "@geist-ui/core";
import { TableColumnRender } from "@geist-ui/core/esm/table";
import { GetServerSideProps } from "next";

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  padding: 0.5rem;
  box-shadow: 0px 2px 8px 0px #00000040;
  border-radius: 4px;
`;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { id } = params as { id: string };

  const res = await fetch(`${CARTS_URL}/${id}`);
  const cart = await res.json();

  return {
    props: {
      cart,
    },
  };
};

export default function CartsPage({ cart }: { cart: CartRecord }) {
  const renderProductAmount: TableColumnRender<
    CartRecord["products"][number]
  > = (_, rowData) => {
    const { price, quantity } = rowData;
    return <>{price * quantity}</>;
  };

  const renderDiscount: TableColumnRender<CartRecord["products"][number]> = (
    value
  ) => {
    return <>{value || 0}%</>;
  };

  return (
    <div style={{ padding: "1rem" }}>
      <Text h1 py={1}>
        Cart Details
      </Text>

      {cart.id == null ? (
        <Note type="error" label="">
          Cart not found.
        </Note>
      ) : (
        <>
          <Text h3 mb={1}>
            Details
          </Text>
          <DetailGrid>
            <Description title="User" content={cart.id} />
            <Description title="Total Amount" content={cart.total} />
            <Description title="# of items" content={cart.totalQuantity} />
            <Description title="Discounted" content={cart.discountedTotal} />
          </DetailGrid>

          <Text h3 mb={1} mt={3}>
            Products
          </Text>
          <div style={{ overflowX: "auto" }}>
            <Table data={cart.products} emptyText="No data">
              <Table.Column prop="title" label="Product Name" />
              <Table.Column prop="price" label="Price" />
              <Table.Column prop="quantity" label="Qty" />
              <Table.Column
                prop="id"
                label="Amount"
                render={renderProductAmount}
              />
              <Table.Column
                prop="discountPercentage"
                label="Discount %"
                render={renderDiscount}
              />
              <Table.Column prop="discountedPrice" label="Discounted Amount" />
            </Table>
          </div>
        </>
      )}
    </div>
  );
}
