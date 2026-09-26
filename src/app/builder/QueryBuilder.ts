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

        this.modelQuery = this.modelQuery.find(queryObj as FilterQuery<T>);

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



}

export default QueryBuilder;