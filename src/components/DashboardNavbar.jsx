"use client";

import React from "react";
import {
  Burger,
  Button,
  Drawer,
  Flex,
  Menu,
  Text,
} from "@mantine/core";
import { Icon } from "@iconify/react";
import Sidebar from "./Sidebar";
import NextImage from "next/image";
import Link from "next/link";
import Image from "next/image";

export default function DashboardNavbar({
  toggle,
  opened,
  setDarkMode,
  darkMode,
}) {
  return (
    <>
      {/* Burger menu for small screens */}
      <Burger
        onClick={toggle}
        size="sm"
        className="ml-2 duration-[400ms]"
        color={darkMode ? "white" : "black"}
      />

      {/* Drawer for mobile sidebar */}
      <Drawer
        hiddenFrom="sm"
        opened={opened}
        onClose={toggle}
        overlayProps={{ backgroundOpacity: 0.3, blur: 2 }}
        padding="md"
      >
        <Sidebar />
      </Drawer>

      {/* Right-side user controls */}
      <div className="mr-2 cursor-pointer flex items-center gap-2">
        {/* Dark mode toggle */}
        {/* <Button
          variant="transparent"
          onClick={() => setDarkMode((val) => !val)}
          className="relative"
        >
          <Icon
            icon="mdi:moon-waning-crescent"
            width={20}
            height={20}
            className={`transition-all duration-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${
              darkMode ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"
            }`}
          />
          <Icon
            icon="mdi:weather-sunny"
            width={22}
            height={22}
            className={`transition-all duration-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${
              darkMode ? "opacity-0 rotate-90" : "opacity-100 rotate-0"
            }`}
          />
        </Button> */}

        {/* Profile menu */}
        <Menu
          width={200}
          transitionProps={{ transition: "pop-top-right", duration: 150 }}
          position="bottom-end"
        >
          <Menu.Target>
            <Image
              src="/profil.jpeg"
              className="!w-8 !h-8 object-cover !rounded-full"
              width={80}
              height={80}
              alt="User profile"
            />
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>
              <div className="flex gap-2 items-center">
                <NextImage
                  src="/profil.jpeg"
                  alt="User"
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
                <div>
                  <Text size="sm" fw={600}>
                    Sahroni
                  </Text>
                  <Text size="xs" className="opacity-70">
                    Admin
                  </Text>
                </div>
              </div>
            </Menu.Label>

            <Menu.Divider />

            {/* Menu items */}
            <Menu.Item component={Link} href="/">
              <Flex align="center" gap={8}>
                <Icon icon="ic:round-home" width={22} color="grey" />
                <div>Home</div>
              </Flex>
            </Menu.Item>

            <Menu.Item>
              <Flex align="center" gap={8}>
                <Icon icon="mdi:account-circle-outline" width={22} color="grey" />
                <div>Profile</div>
              </Flex>
            </Menu.Item>

            <Menu.Item>
              <Flex align="center" gap={8}>
                <Icon icon="mdi:logout" width={22} color="grey" />
                <div>Logout</div>
              </Flex>
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>
    </>
  );
}
