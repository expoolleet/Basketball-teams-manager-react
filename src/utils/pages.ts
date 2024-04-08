export const getPagesArray = (totalPages: number) : number[] => { // функция для получения массива страниц
    const pages = []
    
    for (let i = 0; i < totalPages; i++)
    {
        pages.push(i + 1)
    }
    return pages
}