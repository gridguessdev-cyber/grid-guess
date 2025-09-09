"use client";
import { Tooltip } from "@heroui/tooltip";
import Link from "next/link";
import GoogleSignInButton from "../GoogleSignInButton";
import Script from "next/script";
import { useStore } from "@/store/store";
import AccountTooltip from "../AccountTooltip";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
} from "@heroui/react";
import { useServices } from "@/providers/ServicesProvider";
import { useEffect, useState } from "react";

export default function Header() {
  const { isOpen, onOpenChange, onOpen } = useDisclosure();
  const { user, setUser } = useStore((state) => state);
  const { usersService } = useServices();

  const [userName, setUserName] = useState(user?.full_name || "");

  useEffect(() => {
    if (user) {
      setUserName(user.full_name || "");
    }
  }, [user]);

  const handleAccountEdit = async () => {
    const editedUser = await usersService.editUserDetails({
      id: user?.id,
      full_name: userName,
    });
    setUser(editedUser);
  };

  return (
    <div className="mb-5 mx-[10%]">
      <div className="flex items-center justify-between">
        <div className="flex flex-1 justify-start gap-3">
          <Link href="/levels" className="hover:underline" prefetch>
            Explore levels
          </Link>
          {user && (
            <Link href={`/builder`} className="hover:underline" prefetch>
              Build your level
            </Link>
          )}
          {!user && (
            <Tooltip
              closeDelay={50}
              placement="bottom"
              content={
                <div className="px-1 py-2 text-center flex flex-col gap-2">
                  Sign in to build your levels
                  <GoogleSignInButton />
                </div>
              }
            >
              <Link href="#" className="hover:underline" prefetch>
                Build your level
              </Link>
            </Tooltip>
          )}
        </div>
        <p className="alfa-slab-one-regular text-center my-5 text-3xl flex-1">
          Countries Grid
        </p>
        <div className="flex flex-1 justify-end">
          <Tooltip
            closeDelay={50}
            placement="bottom-end"
            content={
              <div className="px-1 py-2">
                <AccountTooltip onEditModalOpen={onOpen} />
              </div>
            }
          >
            <button>Account</button>
          </Tooltip>
        </div>
      </div>
      <hr />
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Edit account
              </ModalHeader>
              <ModalBody>
                <Input
                  label="User name"
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  onPress={async () => {
                    await handleAccountEdit();
                    onClose();
                  }}
                >
                  Save
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
      />
    </div>
  );
}
