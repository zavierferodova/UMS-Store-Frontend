"use client"
import { IPaginationResponse } from "@/domain/model/response"
import { Product } from "@/domain/model/product"
import { PageStatus } from "@/lib/page"
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

    const fetchProductData = useCallback(async () => {
        setStatus(PageStatus.LOADING)
        try {
            // const response = await getProducts(page, limit)
            // setProducts({
            //     data: response.content,
            //     meta: {
            //         total: response.totalElements,
            //         page: response.number,
            //         limit: response.size,
            //         next: null,
            //         previous: null,
            //     }
            // })
        } finally {
            setStatus(PageStatus.SUCCESS)
        }
    }, [page, limit])


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
        fetchProductData()
    }, [fetchProductData])

    return {
        search,
        page,
        limit,
        status,
        products,
        updatePage,
        updateLimit,
        updateSearch,
    }
}
