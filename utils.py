def serialize(obj):
    if obj is None:
        return None
    data = {}
    for column in obj.__table__.columns:    
        value = getattr(obj, column.name)   
        if hasattr(value, 'isoformat'):     
            value = value.isoformat()
        data[column.name] = value           
    return data
