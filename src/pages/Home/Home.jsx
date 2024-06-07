import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import "./home.css"
import Footer from "../../Footer/Footer"
const Home = () => {
    const url = "https://api.coinranking.com/v2/coins?limit=10";
    const [coins, setCoins] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setLoading] = useState(true)
    const localCoins = localStorage.getItem("coins")
    const cryptoApiKey = import.meta.env.COIN_API
    useEffect(() => {
        if(localCoins){
            setCoins(JSON.parse(localCoins))
           setTimeout(() => {
            setLoading(false)
           }, 200);
        } else{
            function fetchData() {
                axios.get(url, {
                    headers: {
                        'x-access-token': cryptoApiKey
                    }
                })
                .then(response => {
                    setCoins(response.data.data.coins)
                    localStorage.setItem("coins", JSON.stringify(response.data.data.coins));
                    setLoading(false)
                })
                .catch(error => {
                    console.error(error);
                    setError('Failed to fetch data');
                });
          }
          fetchData();

        }       
      
    }, []);

   


    const [stats, setStats] = useState({})

    useEffect(() => {
        function fetchMarkets() {
            const urli = "https://api.coinranking.com/v2/stats";
            axios.get(urli, {
                headers: {
                    'x-access-token': cryptoApiKey
                }
            })
            .then(response => {
                setStats(response.data.data)
            })
            .catch(error => {
                console.error(error);
            });
        }
        fetchMarkets();
    }, []);

    if (error) {
        return <div>{error}</div>;
    }

    if(isLoading){
        return <Load><div className="loader"></div></Load>
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
    };
    
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
            return "$" +parseFloat(price).toFixed(2);
        } else {
            return "$" + parseFloat(price).toFixed(4);
        }
    }
    
    
    
    
    
    return (
    <>{
        stats.totalCoins &&  <div className='stats'>
    <h2 className="center-heading">Global Crypto Statistics</h2>
    <div className="grid-container">
        <div>
            <p>Total Crypto Currencies</p> 
            <p className="bold-txt">{stats.totalCoins}</p>
        </div>
        <div> 
            <p>Total Market</p> 
            <p className="bold-txt">{formatPrice(stats.totalMarkets)}</p>
        </div>
        <div>  
            <p>Total MarketCap</p> 
            <p className="bold-txt">{formatMarketCap(stats.totalMarketCap)}</p>
        </div>
        <div> 
            <p>Total Exchange</p> 
            <p className="bold-txt">{stats.totalExchanges}</p>
        </div>
    </div>
</div>
 
    }
       

    

    <h2 style={{textAlign:"center"}}>Top 10 Crypto Currencies in the World</h2>
  <Box>
        {
            coins.map((item, index)=>(
                <Wrapper className="hover" key={index} to={"/details/"+item.uuid}>
                <div>
                <h5>{index+1}. {item.name}</h5>
                <img src={item.iconUrl} alt="" />
                </div>
                <p>{formatPrice(item.price)}</p>
                <p> Marketcap : {formatMarketCap(item.marketCap)}</p>
                <p>Daily Change : {item.change}</p>
                </Wrapper>
            ))
        }
        </Box>
       
       <Footer />
    </>
       
    );
};

const Wrapper = styled(NavLink)`
text-decoration:none;
color:black;
div{
    display: flex;
    align-items: center;
    justify-content: space-around;
    border-bottom:1px solid black;
img{
 width: 30px;
 height: 30px;
}
}
border: none;
border-radius:15px;
padding: 15px;
background-color: white;

`
const Box = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    grid-gap: 20px;
    width: 90%;
    margin: 0 auto;
    margin-bottom:100px;
    @media (max-width: 768px) {
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    }

    @media (max-width: 480px) {
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    }
`;


const Load = styled.div`
display: flex;
justify-content: center;
align-items: center;
margin-top:100px;
`

export default Home;
