import { FilterQuery, Query } from "mongoose";

class QueryBuilder<T> {
    public modelQuery: Query<T[], T>;
    public query: Record<string, unknown>;

    constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
        this.modelQuery = modelQuery;
        this.query = query;
    };

    // search by any field
    search(searchableFields: string[]) {
        const searchTerm = this?.query?.searchTerm;

        if (searchTerm) {
            this.modelQuery = this.modelQuery.find({
                $or: searchableFields.map(
                    (field) =>
                        ({
                            [field]: { $regex: searchTerm, $options: 'i' },
                        }) as FilterQuery<T>,
                ),
            });
        }

        return this;
    };

    // filter by any field
    filter() {
        const queryObj = { ...this.query };

        const excludeFields = ["searchTerm", "sort", "limit", "page", "fields"];
        excludeFields?.forEach((field) => delete queryObj[field]);

        // Fix for serverless environments (like Vercel) that flatten req.query instead of parsing nested objects
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const formattedQueryObj: Record<string, any> = {};
        for (const key in queryObj) {
            const match = key.match(/^([^[]+)\[([^\]]+)\]$/);
            if (match) {
                const [, field, operator] = match;
                if (!formattedQueryObj[field]) formattedQueryObj[field] = {};
                formattedQueryObj[field][operator] = queryObj[key];
            } else {
                formattedQueryObj[key] = queryObj[key];
            }
        }

        this.modelQuery = this.modelQuery.find(formattedQueryObj as FilterQuery<T>);

        return this;
    };

    // sort by any field
    sort() {
        const sort = (this?.query?.sort) || "-createdAt";

        this.modelQuery = this.modelQuery.sort(sort as string);

        return this;
    };

    // paginate the results
    paginate() {
        const page = Number(this?.query?.page) || 1;
        const limit = Number(this?.query?.limit) || 5;
        const skip = (page - 1) * limit;

        this.modelQuery = this?.modelQuery?.skip(skip)?.limit(limit);

        return this;
    };

    // fields filtering
    fields() {
        const fields =
            (this?.query?.fields as string)?.split(',')?.join(' ') || '-__v';

        this.modelQuery = this.modelQuery.select(fields);
        return this;
    };


    async countTotal() {
        const totalQueries = this.modelQuery.getFilter();
        const total = await this.modelQuery.model.countDocuments(totalQueries);
        const page = Number(this?.query?.page) || 1;
        const limit = Number(this?.query?.limit) || 5;
        const totalPage = Math.ceil(total / limit);

        return {
            page,
            limit,
            total,
            totalPage,
        };
    }
}

export default QueryBuilder;