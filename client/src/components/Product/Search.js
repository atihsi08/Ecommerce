import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MetaData from '../MetaData.js';
import './Search.css';

function Search() {

    const [keyword, setKeyword] = useState('');
    const navigate = useNavigate();

    const searchSubmitHandler = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            console.log(keyword);
            navigate(`/products/${keyword}`);
        }
        else {
            navigate('/products');
        }
    }

    return (
        <>
            <MetaData title="Search a Product -- ECOMMERCE" />
            <form className="searchBox" onSubmit={searchSubmitHandler}>
                <input
                    type="text"
                    placeholder="Search a Product ..."
                    onChange={e => setKeyword(e.target.value)}
                />

                <button type="submit">Search</button>
            </form>
        </>
    )
}

export default Search
