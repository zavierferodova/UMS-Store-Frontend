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
    const [statusFilter, setStatusFilter] = useState<string[]>([])
    const [categoryFilter, setCategoryFilter] = useState<string[]>([])
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
        if (user) {
            setStatus(PageStatus.LOADING)
            try {
                const response = await productData.getProducts({
                    limit,
                    page,
                    search,
                    status: statusFilter,
                    categories: categoryFilter
                })
                setProducts({
                    data: response.data,
                    meta: response.meta
                })
            } finally {
                setStatus(PageStatus.SUCCESS)
            }
        }
    }, [user, page, limit, search, statusFilter, categoryFilter])

    const updatePage = (page: number) => {
        setPage(page)
    }

    const updateLimit = (limit: number) => {
        setPage(1)
        setLimit(limit)
    }

    const updateSearch = (search: string) => {
        setSearch(search)
        setPage(1)
    }

    const handleStatusFilterChange = (status: string[]) => {
        setStatusFilter(status)
        setPage(1)
    }

    const handleCategoryFilterChange = (category: string[]) => {
        setCategoryFilter(category)
        setPage(1)
    }

    useEffect(() => {
        fetchProductData()
    }, [fetchProductData])

    return {
        user,
        search,
        page,
        limit,
        status,
        products,
        statusFilter,
        categoryFilter,
        updatePage,
        updateLimit,
        updateSearch,
        onStatusFilterChange: handleStatusFilterChange,
        onCategoryFilterChange: handleCategoryFilterChange
    }
}
