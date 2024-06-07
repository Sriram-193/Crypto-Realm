import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import Footer from "../../Footer/Footer";
import "./details.css";
import { AiOutlineDollar, AiOutlineThunderbolt } from "react-icons/ai";
import { GiRank1 } from "react-icons/gi";
import { SlTrophy } from "react-icons/sl";
import { CgDanger } from "react-icons/cg";
import { CiLink } from "react-icons/ci";
import { RiExchangeFundsFill } from "react-icons/ri";
import { MdStackedLineChart } from "react-icons/md";
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const Details = () => {
    const [error, setError] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const [coin, setCoin] = useState(null);
    const [prices, setPrices] = useState([]);
    const params = useParams();
    const cryptoApiKey = import.meta.env.COIN_API;
    const coinId = params.id;
    const url = `https://api.coinranking.com/v2/coin/${coinId}`;
    const historyUrl = `https://api.coinranking.com/v2/coin/${coinId}/history?timePeriod=1h`;

    const duration = useRef("");

    useEffect(() => {
        axios.get(historyUrl, {
            headers: {
                'x-access-token':cryptoApiKey
            }
        })
        .then(response => {
            setPrices(response.data.data.history.reverse());
            setLoading(false);
        })
        .catch(error => {
            console.error(error);
            setError('Failed to fetch data');
        });
    }, [historyUrl]);

    useEffect(() => {
        axios.get(url, {
            headers: {
                'x-access-token': cryptoApiKey
            }
        })
        .then(response => {
            setCoin(response.data.data.coin);
            setLoading(false);
        })
        .catch(error => {
            console.error(error);
            setError('Failed to fetch data');
        });
    }, [url]);

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

    function formatDate(timestamp) {
        const date = new Date(timestamp * 1000); 
        return date.toLocaleDateString("en-US") + ' ' + date.toLocaleTimeString("en-US");
    }

    function handleChange() {
        const historyUrl = `https://api.coinranking.com/v2/coin/${coinId}/history?timePeriod=${duration.current.value}`;
        axios.get(historyUrl, {
            headers: {
                'x-access-token': cryptoApiKey
            }
        })
        .then(response => {
            setPrices(response.data.data.history.reverse());
            setLoading(false);
        })
        .catch(error => {
            console.error(error);
            setError('Failed to fetch data');
        });
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (isLoading) {
        return <Load><div className="loader"></div></Load>;
    }

    const labels = prices.map(item => formatDate(item.timestamp));
    const data = {
        labels: labels,
        datasets: [{
            label: `${coin?.name || 'Coin'} Price`,
            data: prices.map(item => parseFloat(item.price)),
            borderColor: 'rgba(75, 192, 192, 1)',
            fill: false,
            tension: 0.1
        }]
    };

    return (
        <>
            <h2 style={{textAlign:"center"}}>{coin?.name}({coin?.symbol}) Price Chart</h2>
            
            <div className='chart'>
                <div className='chart-controls'>
                    <select onChange={handleChange} ref={duration} className='duration'>
                        <option value="1h">1h</option>
                        <option value="3h">3h</option>
                        <option value="12h">12h</option>
                        <option value="24h">24h</option>
                        <option value="7d">7d</option>
                        <option value="30d">30d</option>
                        <option value="3m">3m</option>
                        <option value="1y">1y</option>
                        <option value="3y">3y</option>
                        <option value="5y">5y</option>
                    </select>
                    <p>Change: <span><b>{coin?.change} %</b></span></p>
                    <p>Current {coin?.name} price: <span><b>{formatPrice(coin?.price)}</b></span></p>
                </div>
                <Line data={data} />
            </div>

            <div className='table-grid'>
                <Box className='description'>
                    <thead>
                        <tr>
                            <td><h3>What is {coin?.name}?</h3></td>
                        </tr>
                        <tr>
                            <td><p>{coin?.description}</p></td>
                        </tr>
                    </thead>
                </Box>

                <Box className='center'>
                    <thead>
                        <tr>
                            <th colSpan="2"><h3>{coin?.name} Value Statistics</h3></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colSpan="2"><p>An overview showing the statistics of {coin?.name}, such as the base and quote currency, the rank, and trading volume.</p></td>
                        </tr>
                        <tr>
                            <td><p><AiOutlineDollar /> Price to USD</p></td>
                            <td><p className='bold'>{formatPrice(coin?.price)}</p></td>
                        </tr>
                        <tr>
                            <td><p><GiRank1 /> Rank</p></td>
                            <td><p className='bold'>{coin?.rank}</p></td>
                        </tr>
                        <tr>
                            <td><p><AiOutlineThunderbolt /> 24h Volume</p></td>
                            <td><p className='bold'>{formatPrice(coin?.["24hVolume"])}</p></td>
                        </tr>
                        <tr>
                            <td><p><AiOutlineDollar /> Market cap</p></td>
                            <td><p className='bold'>{formatMarketCap(coin?.marketCap)}</p></td>
                        </tr>
                        <tr>
                            <td><p><SlTrophy /> All-time-high (daily avg.)</p></td>
                            <td><p className='bold'>{formatPrice(coin?.allTimeHigh?.price)}</p></td>
                        </tr>
                    </tbody>
                </Box> 

                <Box className='center'>
                    <thead>
                        <tr>
                            <th colSpan="2"><h3>Other Statistics Info</h3></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colSpan="2"><p>An overview showing the statistics of {coin?.name}, such as the base and quote currency, the rank, and trading volume.</p></td>
                        </tr>
                        <tr>
                            <td><p><MdStackedLineChart /> Number Of Markets</p></td>
                            <td><p className='bold'>{coin?.numberOfMarkets}</p></td>
                        </tr>
                        <tr>
                            <td><p><RiExchangeFundsFill /> Number Of Exchanges</p></td>
                            <td><p className='bold'>{coin?.numberOfExchanges}</p></td>
                        </tr>
                        <tr>
                            <td><p><CgDanger /> Approved Supply</p></td>
                            <td><p className='bold'>{formatPrice(coin?.supply?.supplyAt)}</p></td>
                        </tr>
                        <tr>
                            <td><p><CgDanger /> Total Supply</p></td>
                            <td><p className='bold'>{formatPrice(coin?.supply?.total)}</p></td>
                        </tr>
                        <tr>
                            <td><p><CgDanger /> Circulating Supply</p></td>
                            <td><p className='bold'>{formatPrice(coin?.supply?.circulating)}</p></td>
                        </tr>
                    </tbody>
                </Box>

                <Box className='center'>
                    <thead>
                        <tr>
                            <th colSpan="2"><h3>{coin?.name} Links</h3></th>
                        </tr>
                    </thead>
                    <tbody>
                        {coin?.links?.map((item, index) => (
                            <tr key={index}>
                                <td><p><CiLink /> {item.name}</p></td>
                                <td><a href={item.url}><p>{item.name}</p></a></td>
                            </tr>
                        ))}
                    </tbody>
                </Box> 
            </div>

            <Footer />
        </>
    );
};

const Box = styled.table`
padding: 20px;
`;

const Load = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 100px;
`;

export default Details;
