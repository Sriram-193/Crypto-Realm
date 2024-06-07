import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Footer from '../../Footer/Footer';

const News = () => {
    const newsApiKey = import.meta.env.NEWS_API;
    const url = `https://min-api.cryptocompare.com/data/v2/news/?api_key=${newsApiKey}&lang=EN`;

    const [news, setNews] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        function fetchData() {
            axios.get(url)
                .then(response => {
                    setNews(response.data.Data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error(error);
                    setError('Failed to fetch data');
                    setLoading(false);
                });
        }
        fetchData();
    }, []);

    if (error) {
        return <div>{error}</div>;
    }

    if (isLoading) {
        return <Load><div className="loader"></div></Load>;
    }

    const formatDate = (unixTimestamp) => {
        const date = new Date(unixTimestamp * 1000);
        const now = new Date();
        const diff = Math.floor((now - date) / 1000); 
    
        const units = [
            { label: "year", seconds: 31536000 },
            { label: "month", seconds: 2592000 },
            { label: "day", seconds: 86400 },
            { label: "hour", seconds: 3600 },
            { label: "minute", seconds: 60 },
        ];
        for (const unit of units) {
            const unitDiff = Math.floor(diff / unit.seconds);
            if (unitDiff >= 1) {
                return `${unitDiff} ${unit.label}${unitDiff === 1 ? '' : 's'} ago`;
            }
        }
        return 'just now';
    };

    return (
        <>
            <NewsContainer>
                <h1>Latest News</h1>
                <NewsList>
                    {news.map((item, index) => (
                        <NewsItem key={index}>
                            <ImageContainer>
                                <NewsImage src={item.imageurl || 'https://via.placeholder.com/150'} alt={item.title} />
                            </ImageContainer>
                            <TextContainer>
                                <p className='title'>{item.source}  <span className='time'>{formatDate(item.published_on)}</span></p>
                                <NewsTitle>{item.title}</NewsTitle>
                                <NewsDescription>{item.body}</NewsDescription>
                                <NewsLink href={item.url} target="_blank" rel="noopener noreferrer">Read more</NewsLink>
                                <p className='category'>Categories : <span className='ct-in'>{item.categories}</span></p>
                            </TextContainer>
                        </NewsItem>
                    ))}
                </NewsList>
            </NewsContainer>
            <Footer />
        </>
    );
};

const Load = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 100px;
`;

const NewsContainer = styled.div`
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;

    @media (max-width: 768px) {
        padding: 10px;
    }
`;

const NewsList = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 20px;
    overflow: hidden;
`;

const NewsItem = styled.div`
    display: flex;
    border-bottom: 1px solid #ccc;
    padding: 20px 0;

    @media (max-width: 768px) {
        flex-direction: column;
        padding: 10px 0;
    }
`;

const ImageContainer = styled.div`
    flex: 0 0 150px;
    margin-right: 20px;
    text-align: center;

    @media (max-width: 768px) {
        flex: 1;
        margin-right: 0;
        margin-bottom: 10px;
    }
`;

const NewsImage = styled.img`
    width: 150px;
    height: 100px;
    object-fit: cover;

    @media (max-width: 600px) {
        width: 60%;
        height: auto;
    }
`;

const TextContainer = styled.div`
    flex: 1;
    .title {
        margin: 0;
        color: rgb(247, 153, 52);
        font-weight: bold;
        font-size: 1rem;
    }
    .title .time {
        font-weight: lighter;
        color: gray;
        margin-left: 10px;
    }
    .category {
        color: rgb(70, 70, 70);
        font-weight: 500;
        font-size: 0.9rem;
    }
    .category .ct-in {
        letter-spacing: 1px;
    }

    @media (max-width: 768px) {
        .title, .category {
            font-size: 0.9rem;
        }
        .title .time {
            font-size: 0.8rem;
        }
        p {
            font-size: 0.8rem;
        }
    }
`;

const NewsTitle = styled.h2`
    margin: 0;
    margin-top: 10px;
    font-size: 1.2rem;

    @media (max-width: 768px) {
        font-size: 1rem;
    }
`;

const NewsDescription = styled.p`
    margin: 5px 0;
    color: #666;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;

    @media (max-width: 768px) {
        font-size: 0.9rem;
    }
`;

const NewsLink = styled.a`
    color: blue;
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }

    @media (max-width: 768px) {
        font-size: 0.9rem;
    }
`;

export default News;
