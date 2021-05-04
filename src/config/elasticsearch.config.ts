import { Client } from "elasticsearch";

export class ElasticService {
    public client: Client;
    
    constructor() {
        this.connect();
        this.init();
    }
    
    private async connect() {
        try {
            const hostList: string[] = JSON.parse(process.env.ELASTIC_URL_LIST);
            this.client = new Client({
                hosts: hostList,
                log: 'trace',
                maxRetries: 5,
                requestTimeout: 60000,
            });
            console.log('Elasticsearch client connected.');
        } catch(error) {
            console.error('Error happend while connecting to elasticsearch', error.message);
        }
	}

    private async init() {
        try {
            // Create pipeline
            await this.client.ingest.putPipeline({
                id: process.env.ELASTIC_INGEST_PIPELINE_KEY,
                body: {
                    description: `Creates ${process.env.ELASTIC_INGEST_PIPELINE_KEY} pipeline when a document is initially indexed`,
                    processors: [{
                        set: {
                            field: '_source.timestamp',
                            value: '{{_ingest.timestamp}}'
                        }
                    }]
                }
            })
            console.log(`success create pipeline`)
        } catch(error) {
            console.error(`pipeline: ${process.env.ELASTIC_INGEST_PIPELINE_KEY} already exist`)
        }
    }

    private async addIndex(index: string, mapping: any) {
        try {
            // Create index & mapping types
            await this.client.indices.create({
                index,
                body: {
                    mappings: {
                        // properties: MessageElasticMappingType,
                    },
                    settings: {
                        final_pipeline: process.env.ELASTIC_INGEST_PIPELINE_KEY
                    }
                }
            });
            
            console.log(`success create ${process.env.ELASTIC_INDEX_KEY} index`);
        } catch(error) {
            console.log(`error: create index, ${error}`)
            console.error(`error: index ${process.env.ELASTIC_INDEX_KEY} already exist`)
        }
    }

    public async reset() {
        try {
            // Delete pipeline
            this.client.ingest.deletePipeline({ id: process.env.ELASTIC_INGEST_PIPELINE_KEY })
            console.log(`delete elastic pipeline`)
        } catch (error) {
            console.error(error)
        }

        // TODO: Delete all known indexes
    }

    public async getByCondition(indexKey: string, docType, queryData) {
        const searchRes: any = await this.search(indexKey, docType, queryData)
        return searchRes.hits.hits
    }
    
    public async create(index: string, type: string, body: any) {
        return await this.client.index({
            index,
            type,
            refresh: 'wait_for',
            body
        })
    }

    public async search(index: string, type: string, queryData: any) {
        return await this.client.search({
            index,
            type,
            body: { 
                query: queryData
            }
        })
    }

    public async update(index: string, type: string, id: string, updateData: any) {
        return await this.client.update({
            index,
            type,
            id,
            refresh: 'wait_for',
            body: {
                doc: updateData
            }
        })
    }

    public async delete(index: string, type: string, id: string) {
        return await this.client.delete({
            index,
            type,
            refresh: 'wait_for',
            id
        })
    }
}