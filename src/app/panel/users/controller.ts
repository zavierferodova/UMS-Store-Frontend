import userData from "@/data/user"
import { IPaginationResponse } from "@/domain/model/response"
import { User } from "@/domain/model/user"
import { PageStatus } from "@/lib/page"
import { useCallback, useEffect, useState } from "react"

export const useController = () => {
    const [status, setStatus] = useState(PageStatus.LOADING)
    const [limit, setLimit] = useState(10)
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState("")
    const [role, setRole] = useState<string[]>([])
    const [users, setUsers] = useState<IPaginationResponse<User>>({
        data: [],
        meta: {
            total: 0,
            page: 1,
            limit: 10,
            next: null,
            previous: null,
        },
    })

    const fetchUserData = useCallback(async () => {
        setStatus(PageStatus.LOADING)
        try {
            const response = await userData.getUsers({ page, limit, search, role })
            setUsers({
                data: response.data,
                meta: response.meta
            })
        } finally {
            setStatus(PageStatus.SUCCESS)
        }
    }, [page, limit, search, role])


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

    const updateRole = (role: string[]) => {
        setPage(1)
        setRole(role)
    }

    useEffect(() => {
        fetchUserData()
    }, [fetchUserData])

    return {
        search,
        page,
        limit,
        status,
        users,
        updatePage,
        updateLimit,
        updateSearch,
        updateRole
    }
}