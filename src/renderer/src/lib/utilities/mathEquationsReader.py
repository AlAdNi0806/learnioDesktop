# Функциональное программирование (ФП)
# - Объектно-ориентированное программирование (ОПП)
# - Процедурное программирование (ПП)

# 1. Отличия процедурного программирования от функционального
# ПП - p: A -> \emptyset
# ФП - f: A -> B (чистая функция)
# f(x) = x ** 2
# Функции высшего порядка (ФВП)
# Каррирование (currying)
# MyPy (статический анализатор)
# TypeGuard
from typeguard import typechecked
from typing import Callable

@typechecked
def add(x: int, y: int):
    return x + y

@typechecked
def add(x: int):
    @typechecked
    def inner(y: int) -> int:
        return x + y
    return inner

add: Callable[[int], Callable[[int], int]] = \
    lambda x: lambda y: x + y

# Частичное применение
# add10 = add(10)
# print(add10(20))
# print(add10(30))

# 2. ООП VS ФП
# SOLID - ОПП-принципы проектирования.
# S - Single Responsibility Principle (SRP)
# O - Open/Closed (OCP)
# ...
# Functions, Partial Application
import requests

class Api:
    def __init__(self, url: str):
        self.url = url

    def fetch(self, route: str):
        return requests.get(self.url + route).json()

# Декоратор (как шаблон ООП).
class LoggedApi:
    def __init__(self, api: Api):
        self.api = api

    def fetch(self, route: str):
        print('Отправляем запрос на адрес', route)
        response = self.api.fetch(route)
        print('Данные успешно получены:', response)
        return response

# api = LoggedApi(Api('https://kispython.ru/api/v1/'))
# api.fetch('/group/prefixes')

# Декоратор (ФП)
def logged(func):
    def fetch(route: str):
        print('Отправляем запрос на адрес', route)
        response = func(route)
        print('Данные успешно получены:', response)
        return response
    return fetch

def api(url: str):
    @logged # <-
    def fetch(route: str):
        return requests.get(url + route).json()
    return fetch

# fetch = api('https://kispython.ru/api/v1/')
# fetch('/group/prefixes')

# 3. ФП на практике.
# Символьное дифференцирование.
# WolframAlpha.
# Строка -> AST -> TRS (Term Rewriting System) -> AST -> LaTeX
# Формы Бэкуса-Наура (БНФ)
# peco.py: https://github.com/true-grue/peco/tree/main
# Автомата с магазинной памятью (стек).
from peco import *
from pprint import pprint

'''
<op> ::= ^ | * | +
<expr> ::= <строка>
         | <число>
         | ( <expr> <op> <expr> )
         | <строка> ( <expr> { , <expr> } )
'''

op = cite(alt(sym('^'), sym('*'), sym('+')))
var = cite(seq(letter, many(letter)))
num = seq(cite(seq(digit, many(digit))), to(lambda x: int(x)))

mkbinop = to(lambda left, op, right: (op, left, right))
mkcall = to(lambda name, arg, args: (name, arg, *args))

expr = lambda s: expr(s)
expr = alt(
    seq(sym('('), expr, op, expr, sym(')'), mkbinop),
    seq(var, sym('('), expr, group(many(seq(sym(','), expr))), sym(')'), mkcall),
    var,
    num,
)

FUNCS = {
    '+': '{%s}+{%s}',
    '*': '{%s}{%s}',
    '^': '{%s}^{%s}',
    'ln': '\\ln {%s}',
    '/': '\\frac{%s}{%s}',
    'd': '\\frac{\\partial{(%s)}}{\\partial{%s}}'
}

def tex(tree):
    match tree:
        case (func, *args):
            # f'{func} template {args}'
            # '{a}'.format(a=10)
            # '%s + %s' % (1, 2)
            return FUNCS[func] % tuple(tex(a) for a in args)
        case const:
            return str(const)

def derive(tree):
    match tree:
        case ('d', ('^', x, n), dx) if x == dx:
            return ('*', n, ('^', x, n - 1))
        case ('d', ('+', a, b), dx):
            return ('+', ('d', a, dx), ('d', b, dx))
        case ('d', ('ln', x), dx) if x == dx:
            return ('/', 1, x)
        case ('d', ('*', n, x), dx) if x == dx:
            return n
        case tree:
            return tree

def simplify(tree):
    # TODO
    # -1 * x = -x
    # 0 * x = 0
    # 1 * x = 1
    pass

def rewrite(rule, tree):
    match rule(tree):
        case (func, *args):
            return (func, *(rewrite(rule, a) for a in args))
        case const:
            return const

CODE = 'd((((x^30)+ln(x))+(2*x)),x)'
state = parse(CODE, expr)
tree = state.stack[-1]
pprint(tree)
print(tex(tree), '=', tex(rewrite(derive, tree)))