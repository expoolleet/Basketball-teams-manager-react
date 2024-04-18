import React from 'react'
import classes from './Pagination.module.css'
import ReactPaginate from 'react-paginate'

interface IPaginationProps {
	totalPages: number
	onPageChange(event: any): any
	currentPage: number
	paginationProps: any
}

export default function Pagination(props: any): React.ReactElement {
	const { totalPages, onPageChange, currentPage } = props as IPaginationProps

	return (
		<ReactPaginate
			className={classes.pages}
			pageClassName={classes.page}
			pageLinkClassName={classes.item}
			activeClassName={classes.page_active}
			activeLinkClassName={classes.item}
			previousClassName={[classes.page, classes.prev].join(' ')}
			previousLinkClassName={classes.item}
			nextClassName={[classes.page, classes.next].join(' ')}
			nextLinkClassName={classes.item}
			breakClassName={classes.page}
			breakLinkClassName={classes.item}
			onPageChange={onPageChange}
			pageCount={totalPages}
			breakLabel='...'
			pageRangeDisplayed={4}
			marginPagesDisplayed={1}
			forcePage={currentPage}
			previousLabel=''
			nextLabel=''
			renderOnZeroPageCount={null}
		/>
	)
}
