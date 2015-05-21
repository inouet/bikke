bikke
=======

DynamoDB Command Line Interface


## Installation

```
$ npm install bikke --save
```

## Usage


### Get


```
$ bikke get --table <TableName> \
     --field <field1>,<field2>,<field3> \
     --where user_id:<HashKey> \
     --where timestamp/N:<RangeKey>

```

### Query (Hash-key, Range-key)

```
$ bikke query --table <TableName> \
     --where user_id:<HashKey> \
     (--where  timestamp/N.LT:<RangeKey> \)
     --limit 10

```

### Query (Global Secondary Index)

```
$ bikke query --table <TableName> \
     --index-name <IndexName> \
     --where user_id:<HashKey> \
     (--where timestamp/N.GT:<RangeKey> \)
     --limit 10

```

### Update

```
$ bikke update --table <TableName> \
      --where user_id:<HashKey> \
      (--where timestamp/N:<RangeKey> \)
      --set name/S:John \
      --set age/N:20 \
      --set updated_at/S:2014-12-22 00:18:20

```

### Put

```
$ bikke put --table <TableName> \
       --set user_id/N:1201 \
       --set name/S:John \
       --set age/N:20 
       
```

### Delete


```
$ bikke delete --table <TableName> \
     --where user_id:<HashKey> \
     --where timestamp/N:<RangeKey>
```

### scan

```
$ bikke scan --table <TableName> 

```



## Contributing

1. Fork it ( https://github.com/inouet/bikke/fork )
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create a new Pull Request




