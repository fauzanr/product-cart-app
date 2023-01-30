import { BRANDS, CATEGORIES } from "@/const/product";
import useLocalStorage from "@/hooks/useLocalStorage";
import { ProductFilters } from "@/types";
import styled from "@emotion/styled";
import {
  Button,
  Drawer,
  Input,
  Select,
  Slider,
  Spacer,
  Text,
  useInput,
} from "@geist-ui/core";
import { Filter, X } from "@geist-ui/icons";
import React, { useEffect, useMemo, useState } from "react";

const ActionContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  margin-bottom: 1rem;
  gap: 0.5rem;
`;

const initialState: ProductFilters = {
  keyword: "",
  categories: [],
  brands: [],
  minPrice: 0,
  maxPrice: 2000,
};

const ProductFilter = ({
  onChange,
}: {
  onChange?: (filters: ProductFilters) => void;
}) => {
  const [visible, setVisible] = useState(false);
  const [filters, setFilters] = useState<typeof initialState>(initialState);
  const [localFilter, setLocalFilter] =
    useLocalStorage<ProductFilters>("product-filter");

  const onChangeFilter = <
    T extends keyof typeof initialState,
    K extends typeof initialState[T]
  >(
    name: T,
    value: K
  ) => {
    setFilters((prev) => {
      const newFilter = { ...prev, [name]: value };

      setLocalFilter(newFilter);
      return newFilter;
    });
  };

  const clearFilters = () => {
    setFilters(initialState);
    setLocalFilter(initialState);
  };

  const appliedFilters = useMemo(
    () =>
      (filters.categories.length > 0 ? 1 : 0) +
      (filters.brands.length > 0 ? 1 : 0) +
      (filters.minPrice > initialState.minPrice ? 1 : 0) +
      (filters.maxPrice < initialState.maxPrice ? 1 : 0),
    [filters]
  );

  useEffect(() => {
    if (localFilter) setFilters(localFilter);
  }, [localFilter]);

  useEffect(() => {
    onChange?.(filters);
  }, [filters]);

  return (
    <>
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
          onClick={() => setVisible(true)}
        >
          Filter {appliedFilters > 0 && `(${appliedFilters})`}
        </Button>
        <Input
          placeholder="Search Product"
          clearable
          value={filters.keyword}
          onChange={(e) => onChangeFilter("keyword", e.target.value)}
        />
      </ActionContainer>

      <Drawer
        visible={visible}
        w="280px"
        onClose={() => setVisible(false)}
        disableBackdropClick
      >
        <div style={{ textAlign: "right" }}>
          <Button
            icon={<X />}
            type="abort"
            auto
            mt="-20px"
            mr="-20px"
            onClick={() => setVisible(false)}
          />
        </div>
        <Drawer.Title>Filter Products</Drawer.Title>
        <Drawer.Content>
          <Text small>Category</Text>
          <Select
            placeholder="Select Category"
            w="100%"
            multiple
            value={filters.categories}
            onChange={(v) => onChangeFilter("categories", v as string[])}
          >
            {CATEGORIES.map((category) => (
              <Select.Option key={category} value={category}>
                {category}
              </Select.Option>
            ))}
          </Select>

          <Spacer />

          <Text small>Brand</Text>
          <Select
            placeholder="Select Brand"
            w="100%"
            multiple
            value={filters.brands}
            onChange={(v) => onChangeFilter("brands", v as string[])}
          >
            {BRANDS.map((brand) => (
              <Select.Option key={brand} value={brand}>
                {brand}
              </Select.Option>
            ))}
          </Select>

          <Spacer />

          <Text small>Price Min.</Text>
          <Slider
            step={50}
            min={initialState.minPrice}
            max={initialState.maxPrice}
            type="success"
            mt={0.5}
            ml="10px"
            w="calc(100% - 20px)"
            initialValue={filters.minPrice}
            value={filters.minPrice}
            onChange={(v) => onChangeFilter("minPrice", v)}
          />

          <Spacer />

          <Text small>Price Max.</Text>
          <Slider
            step={50}
            min={initialState.minPrice}
            max={initialState.maxPrice}
            type="success"
            mt={0.5}
            ml="10px"
            w="calc(100% - 20px)"
            initialValue={filters.maxPrice}
            value={filters.maxPrice}
            onChange={(v) => onChangeFilter("maxPrice", v)}
          />

          <Spacer h={2} />

          <div style={{ textAlign: "right" }}>
            <Button type="abort" pr={0} auto onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </Drawer.Content>
      </Drawer>
    </>
  );
};

export default ProductFilter;
