#!/usr/bin/python3
# mod : Authentication module
# cre : lwx 20190926
# upd : lwx 20201120
# ver : 1.0

# # create index sample:
#     # Create a simple index based on the field post_id
#     r.table('comments').index_create('post_id').run(conn)
#     # Create a simple index based on the nested field author > name
#     r.table('comments').index_create('author_name', r.row["author"]["name"]).run(conn)
#     # Create a geospatial index based on the field location
#     r.table('places').index_create('location', geo=True).run(conn)
#     # Create a compound index based on the fields post_id and date
#     r.table('comments').index_create('post_and_date', [r.row["post_id"], r.row["date"]]).run(conn)
#     # Create a multi index based on the field authors
#     r.table('posts').index_create('authors', multi=True).run(conn)

from dbr import Conn
from rethinkdb import r

def initTables():
    try:
        with Conn().getConn() as conn:
            # audit trail
            r.table_create("_a").run(conn)
            r.table("_a").index_create("_k").run(conn)
            # log browsing statistic
            r.table_create("_b").run(conn)
            # project list
            r.table_create("p0").run(conn)
            r.table("p0").index_create("name").run(conn)

    except Exception as e:
        print(e)