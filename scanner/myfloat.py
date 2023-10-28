# TODO: incomplete

class myfloat(float):
    def with_places(self, places):
        self.places = places
        return myfloat(round(self, places))
    
    def __str__(self):
        if not(hasattr(self, 'places')) or self.places is None:
            return super().__str__()
        else:
            return f'{self:.{self.places}f}'
    def __add__(self, other):
        return myfloat(super().__add__(other))
    def __sub__(self, other):
        return myfloat(super().__sub__(other))
    def __mul__(self, other):
        return myfloat(super().__mul__(other))
    def __truediv__(self, other):
        return myfloat(super().__truediv__(other))
    def __floordiv__(self, other):
        return myfloat(super().__floordiv__(other))
    def __mod__(self, other):
        return myfloat(super().__mod__(other))
    def __pow__(self, other):
        return myfloat(super().__pow__(other))

a = 1.2345
b = myfloat(7.8901).with_places(2)
print(((a+b) / 2).with_places(0))