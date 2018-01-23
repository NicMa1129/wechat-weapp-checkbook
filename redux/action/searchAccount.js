export const delSearchRes = () => dispatch => {
    let resData = {
        list: [],
        scrollTop: 0,
        searchValue: ""
    }
    let data = JSON.stringify(resData)
    localStorage.setItem('__searchRes__', data)
}