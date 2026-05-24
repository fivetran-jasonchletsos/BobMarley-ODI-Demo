# Iyaaman — Bob Marley · The Complete Universe

A demo built for Kamal Soliman.

Bob's music, his family, the Wailers, the studios, the road — and everyone he made along the way.

**Live:** https://fivetran-jasonchletsos.github.io/BobMarley-ODI-Demo/

## Pipeline

```
[Source] -> Fivetran -> Iceberg (MDLS) -> Snowflake / Athena / Trino -> dbt Labs -> React
```

- Fivetran lands every CDC row into Iceberg (MDLS) on S3 in open Apache Iceberg format — one copy of the bytes.
- Snowflake, Athena, and Trino read the same Iceberg bytes via external catalogs — no copies, no extracts.
- Fivetran Transformations triggers dbt Labs the moment the source sync finishes.
- bronze -> silver -> gold stays in Iceberg.
