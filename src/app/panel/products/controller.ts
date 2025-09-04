"use client"
import productData from "@/data/product"
import { IPaginationResponse } from "@/domain/model/response"
import { Product } from "@/domain/model/product"
import { PageStatus } from "@/lib/page"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"

export const useController = () => {
    const [status, setStatus] = useState(PageStatus.LOADING)
    const [limit, setLimit] = useState(10)
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState("")
    const [products, setProducts] = useState<IPaginationResponse<Product>>({
        data: [],
        meta: {
            total: 0,
            page: 1,
            limit: 10,
            next: null,
            previous: null,
        },
    })

    const { data: session } = useSession()
    const user = session?.user

    const fetchProductData = useCallback(async () => {
        setStatus(PageStatus.LOADING)
        try {
            const response = await productData.getProducts({ page, limit, search })
            setProducts({
                data: response.data,
                meta: response.meta
            })
        } finally {
            setStatus(PageStatus.SUCCESS)
        }
    }, [user, page, limit, search])

    const updatePage = (page: number) => {
        setPage(page)
    }

    const updateLimit = (limit: number) => {
        setPage(1)
        setLimit(limit)
    }

    const updateSearch = (search: string) => {
        setPage(1)
        setSearch(search)
    }

    useEffect(() => {
        if (user) {
            fetchProductData()
        }
    }, [user, fetchProductData])

    return {
        user,
        search,
        page,
        limit,
        status,
        products,
        updatePage,
        updateLimit,
        updateSearch
    }
}
