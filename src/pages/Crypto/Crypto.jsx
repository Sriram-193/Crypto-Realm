import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Footer from "../../Footer/Footer"
import './crypto.css';
import { FaSearch } from "react-icons/fa";
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
const Crypto = () => {
    const url = "https://api.coinranking.com/v2/coins?limit=100";
    const [coins, setCoins] = useState([]);
    const [filteredCoins, setFilteredCoins] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const localCoins = JSON.parse(localStorage.getItem("morecoins"));
    const cryptoApiKey = import.meta.env.COIN_API
    useEffect(() => {
        if (localCoins) {
            setCoins(localCoins);
            setFilteredCoins(localCoins);
                setLoading(false);
        } else {
            fetchData();
        }
    }, []);

    function fetchData() {
        axios.get(url, {
            headers: {
                'x-access-token': cryptoApiKey
            }
        })
        .then(response => {
            setCoins(response.data.data.coins);
            setFilteredCoins(response.data.data.coins);
            localStorage.setItem("morecoins", JSON.stringify(response.data.data.coins));
            setLoading(false);
        })
        .catch(error => {
            console.error(error);
            setError('Failed to fetch data');
        });
    }

    const inputRef = useRef("");

    function handleChange() {
        const searchTerm = inputRef?.current?.value?.toLowerCase();
        const searchedCoins = coins.filter(coin => coin.name.toLowerCase().includes(searchTerm));
        console.log(searchedCoins)
        setFilteredCoins(searchedCoins);
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (isLoading) {
        return <Load><div className="loader"></div></Load>;
    }

    function formatMarketCap(marketCap) {
        if (marketCap === undefined || marketCap === null) {
            return "N/A";
        }
        if (marketCap >= 1000000000000) {
            return (marketCap / 1000000000000).toFixed(1) + "T";
        } else if (marketCap >= 1000000000) {
            return (marketCap / 1000000000).toFixed(1) + "B";
        } else if (marketCap >= 1000000) {
            return (marketCap / 1000000).toFixed(1) + "M";
        } else {
            return marketCap.toFixed(0);
        }
    }

    function formatPrice(price) {
        if (price === undefined || price === null) {
            return "N/A";
        }
        if (price >= 1000000000) {
            return "$" + (price / 1000000000).toFixed(1) + "B";
        } else if (price >= 1000000) {
            return "$" + (price / 1000000).toFixed(1) + "M";
        } else if (price >= 1000) {
            return "$" + (price / 1000).toFixed(1) + "K";
        } else if (price >= 1) {
            return "$" + parseFloat(price).toFixed(2);
        } else {
            return "$" + parseFloat(price).toFixed(4);
        }
    }

    return (
        <>
            <div className='input-container'>
                <FaSearch />
                <input type="text" ref={inputRef} onChange={handleChange} />
            </div>

            <Box>
                {filteredCoins.length > 0 ? ( 
                    filteredCoins.map((item, index) => (
                        <Wrapper className="hover" key={index} to={"/details/"+item.uuid}>
                            <div>
                                <h5>{index + 1}. {item.name}</h5>
                                <img src={item.iconUrl} alt="" />
                            </div>
                            <p>{formatPrice(item.price)}</p>
                            <p>Marketcap: {formatMarketCap(item.marketCap)}</p>
                            <p>Daily Change: {item.change}</p>
                        </Wrapper>
                    ))
                ) : (
                    <h3>There is no such coin</h3> 
                )}
            </Box>
            <Footer />
        </>
    );
};

const Wrapper = styled(NavLink)`
 text-decoration:none;
 color: black;
    div {
       
        display: flex;
        align-items: center;
        justify-content: space-around;
        border-bottom: 1px solid black;
        img {
            width: 30px;
            height: 30px;
        }
    }
    border: none;
    border-radius: 15px;
    padding: 15px;
    background-color: white;
`;

const Box = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    grid-gap: 20px;
    width: 90%;
    margin: 40px auto;
    margin-bottom: 50px;
    min-height: 50vw;
    transition: 1s;
    @media (max-width: 480px) {
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        min-height: 100vw;
    }
    @media (max-width: 800px) {
    
        min-height: 80vw;
    }
`;

const Load = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 100px;
`;

export default Crypto;
