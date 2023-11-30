import { useState } from "react"

interface IPagination {
    page: number
    perpage: number
}

interface IChangePagination {
    (page: number, perpage?: number): void
}

export default function usePagination(
    page = 1,
    perpage = 10,
): [pagination: IPagination, changePagination: IChangePagination] {
    const [pagination, setPagination] = useState<{ page: number; perpage: number }>({ page, perpage })

    const changePagination = (page: number, perpage: number = pagination.perpage) => {
        setPagination({
            ...pagination,
            page,
            perpage: perpage || pagination.perpage,
        })
    }

    return [pagination, changePagination]
}
