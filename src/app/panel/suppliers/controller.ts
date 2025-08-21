import supplierData from "@/data/supplier";
import { IPaginationResponse } from "@/domain/model/response";
import { Supplier } from "@/domain/model/supplier";
import { PageStatus } from "@/lib/page";
import { useCallback, useEffect, useState } from "react";

export const useController = () => {
    const [status, setStatus] = useState(PageStatus.LOADING);
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [dataStatus, setDataStatus] = useState<string[]>([]);
    const [suppliers, setSuppliers] = useState<IPaginationResponse<Supplier>>({
        data: [],
        meta: {
            total: 0,
            page: 1,
            limit: 10,
            next: null,
            previous: null,
        },
    });

    const fetchSupplierData = useCallback(async () => {
        setStatus(PageStatus.LOADING);
        try {
            const response = await supplierData.getSuppliers({ page, limit, search, status: dataStatus });
            setSuppliers({
                data: response.data,
                meta: response.meta
            });
        } finally {
            setStatus(PageStatus.SUCCESS);
        }
    }, [page, limit, search, dataStatus]);

    const updatePage = (page: number) => {
        setPage(page);
    };

    const updateLimit = (limit: number) => {
        setPage(1);
        setLimit(limit);
    };

    const updateSearch = (search: string) => {
        setPage(1);
        setSearch(search);
    };

    const updateIsDeleted = (status: string[]) => {
        setPage(1);
        setDataStatus(status);
    };

    useEffect(() => {
        fetchSupplierData();
    }, [fetchSupplierData]);

    return {
        search,
        page,
        limit,
        status,
        suppliers,
        updatePage,
        updateLimit,
        updateSearch,
        updateIsDeleted
    };
};