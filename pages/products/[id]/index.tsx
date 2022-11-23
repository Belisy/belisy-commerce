import { products, Cart, OrderItem } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GetServerSidePropsContext } from "next";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import Carousel from "nuka-carousel";
import { useCallback, useState } from "react";

export default function Product(props: { product: products }) {
  return (
    <main className="mt-5 grid place-items-center">
      <div>
        <div>배포테스트</div>
      </div>
    </main>
  );
}
