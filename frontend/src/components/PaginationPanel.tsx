import React, {useState} from "react";

interface PaginationPanelProps {
    totalPages: number;
    onPageChanged: (pageSize: number, currentPage: number) => void;

}

const PaginationPanel: React.FC<PaginationPanelProps> = ({
                                                             totalPages,
                                                             onPageChanged
                                                         }) => {
    const [pageSize, setPageSize] = useState(10); // размер страницы
    const [currentPage, setCurrentPage] = useState(1); // текущая страница
    const [pageSizeCorrect, setPageSizeCorrect] = useState(true)
    const [currentPageCorrect, setCurrentPageCorrect] = useState(true)

    const maxAllowedPageSize = 10;

    const handlePageSizeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSize = parseInt(e.target.value, 10);
        setPageSize(newSize)
        if (!isNaN(newSize) && newSize >= 1 && newSize <= maxAllowedPageSize) {
            setPageSizeCorrect(true)
            setCurrentPage(1);
        } else setPageSizeCorrect(false)
    }


    const handlePageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPage = parseInt(e.target.value, 10);
        setCurrentPage(newPage);
        if (!isNaN(newPage) && newPage >= 1 && newPage <= totalPages) {
            setCurrentPageCorrect(true)
        } else {
            setCurrentPageCorrect(false)
        }
    };

    const handlePreviousPage = async () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = async () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handleGoToPage = async () => {
        onPageChanged(pageSize, currentPage);
    };

    return (
        <div className={"Pagination"}>
            <table>
                <thead>
                <tr>
                    <th colSpan={2}>
                        <p>Навигация</p>
                    </th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>
                        <p>Размер страницы</p>
                        <input
                            value={isNaN(pageSize) ? '' : pageSize}
                            onChange={handlePageSizeChange} //only change, no update
                            min={1}
                            className={pageSizeCorrect ? 'ok' : 'bad'}
                            max={maxAllowedPageSize}
                        />
                        <br/>
                        <button
                            onClick={handleGoToPage} // call update action
                            disabled={!pageSizeCorrect}
                        >Изменить
                        </button>
                    </td>
                    <td>
                        <p>Текущая </p>
                        <button onClick={handlePreviousPage}
                                className={'nav'}
                                disabled={!currentPageCorrect}
                        >{'<'}</button>
                        <input
                            value={isNaN(currentPage) ? '' : currentPage}
                            onChange={handlePageChange} //only page change, no update
                            className={currentPageCorrect ? 'ok' : 'bad'}
                            min={1}
                            max={totalPages}
                        />
                        <button onClick={handleNextPage} className={'nav'} disabled={!currentPageCorrect}>{'>'}</button>

                        <br/>
                        <button onClick={handleGoToPage} disabled={!currentPageCorrect}>Перейти</button>
                    </td>
                </tr>
                </tbody>
            </table>


        </div>
    )
}

export default PaginationPanel;