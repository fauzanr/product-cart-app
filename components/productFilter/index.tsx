import { BRANDS, CATEGORIES } from "@/const/product";
import { ProductFilters } from "@/types";
import { Button, Drawer, Select, Slider, Spacer, Text } from "@geist-ui/core";
import { X } from "@geist-ui/icons";
import React, { useMemo, useState } from "react";

const initialState: ProductFilters = {
  categories: [],
  brands: [],
  minPrice: 0,
  maxPrice: 2000,
};

export const useProductFilter = () => {
  const [visible, setVisible] = useState(false);
  const [filters, setFilters] = useState<typeof initialState>(initialState);

  const onChangeFilter = <
    T extends keyof typeof initialState,
    K extends typeof initialState[T]
  >(
    name: T,
    value: K
  ) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const openFilter = () => {
    setVisible(true);
  };

  const clearFilters = () => {
    setFilters(initialState);
  };

  const appliedFilters = useMemo(
    () =>
      (filters.categories.length > 0 ? 1 : 0) +
      (filters.brands.length > 0 ? 1 : 0) +
      (filters.minPrice > initialState.minPrice ? 1 : 0) +
      (filters.maxPrice < initialState.maxPrice ? 1 : 0),
    [filters]
  );

  const Component = (
    <Drawer visible={visible} w="280px" disableBackdropClick>
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
  );

  return {
    filters,
    Component,
    appliedFilters,
    openFilter,
    clearFilters,
  };
};
