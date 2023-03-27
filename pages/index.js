import { unstable_getServerSession } from "next-auth/next"
import { useSession } from "next-auth/react"
import { prisma } from "../src/prisma"

import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '../styles/Home.module.css'
import Layout from '../src/components/layout'
import Places from "../src/components/crosswalkForm"
import { authOptions } from "./api/auth/[...nextauth]"

// Not in use; redirects automatically to location

export default function Home() {
  return <div>Home</div>
}