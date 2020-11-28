export interface ApiKey {
    id: number
    apiKey: string
}

export interface CountryList {
    name: string
    flag: string
    code: string
}

export interface CountryDB {
    id: number
    list: CountryList[]
}

export interface NewsArticles {
    sourceName: string
    author: string
    title: string
    description: string
    url: string
    image: string
    publishAt: string
    content: string
    timestamp: number
    save: boolean
    country: string
    id?: number
}