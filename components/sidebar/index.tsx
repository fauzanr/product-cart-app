import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { useWindow } from "@/contexts/WindowProvider";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Navigation,
  Package,
  ShoppingCart,
} from "@geist-ui/icons";
import { Button, Text } from "@geist-ui/core";
import { useRouter } from "next/router";

const Relative = styled.div<{ extend: boolean; hide: boolean }>`
  position: relative;
  width: ${({ hide, extend }) => (hide || !extend ? "62px" : "250px")};
`;

const Wrapper = styled.div<{ extend: boolean; hide: boolean }>`
  box-shadow: 0px 2px 8px 0px #00000040;
  height: 100%;
  width: ${({ hide }) => (hide ? "62px" : "250px")};
  position: ${({ extend }) => (extend ? "absolute" : "static")};

  z-index: 1;
  background: white;
`;

const Nav = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  gap: 0.5rem;
  overflow-y: auto;
  overflow-x: hidden;
`;

const NavLink = styled(Button)`
  min-width: 100% !important;
  text-align: left !important;
`;

const links = [
  {
    title: "Products",
    href: "/products",
    icon: <Package />,
  },
  {
    title: "Carts",
    href: "/carts",
    icon: <ShoppingCart />,
  },
];

const Sidebar = () => {
  const { pathname } = useRouter();
  const { isMobile } = useWindow();
  const [hide, setHide] = useState(isMobile);

  useEffect(() => {
    if (isMobile) setHide(true);
    else setHide(false);
  }, [isMobile]);

  return (
    <Relative extend={!isMobile} hide={hide}>
      <Wrapper extend={!isMobile} hide={hide}>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            iconRight={hide ? <ChevronRight /> : <ChevronLeft />}
            type="abort"
            auto
            onClick={() => setHide((prev) => !prev)}
          />
        </div>
        <Nav>
          {links.map((link) => (
            <Link href={link.href} key={link.title}>
              <NavLink
                icon={link.icon}
                type={pathname === link.href ? "success" : "default"}
              >
                {!hide && (
                  <Text span pl="20px">
                    {link.title}
                  </Text>
                )}
              </NavLink>
            </Link>
          ))}
        </Nav>
      </Wrapper>
    </Relative>
  );
};

export default Sidebar;
