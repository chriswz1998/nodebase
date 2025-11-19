import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/db";
import {polar, checkout, portal} from "@polar-sh/better-auth";
import {polarClient} from "@/lib/polar";
// If your Prisma file is located elsewhere, you can change the path
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
        autoSignIn: true,
    },
    plugins: [
        polar({
            client: polarClient,
            createCustomerOnSignUp: true,
            use: [
                checkout({
                    products: [
                        {
                            productId: "60a49ec2-40c3-481f-92c0-42272d7d9b81",
                            slug: "pro"
                        }
                    ],
                    successUrl: process.env.POLAR_SUCCESS_URL,
                    authenticatedUsersOnly: true,
                }),
                portal()
            ]
        })
    ]
});