import styled, { css } from 'styled-components';

export const Container = styled.div`
  background: #fff;
  border-bottom: 2px solid #e6ecf1;
  height: 110px;
  position: relative;
`;

export const Title = styled.div`
  position: absolute;
  top: 20px;
  left: 25px;

  h1 {
    text-transform: uppercase;
    letter-spacing: 0.1em;
    word-spacing: 0.1em;
    font-size: 0.95em;
    line-height: 1;
    font-weight: 700;
    color: #2b2f33;
    border: 2px solid #2b2f33;
    margin: 0;
    padding: 10px 10px;
    border-radius: 5px;
  }
`;

export const NavItem = styled.li<{ active?: boolean }>`
  display: inline-block;

  + li {
    margin-left: 20px;
  }

  a {
    border-bottom: 2px solid transparent;
    padding: 10px 5px;
    font-weight: 600;
    font-size: 0.8em;
    letter-spacing: 0.025em;
    word-spacing: 0.025em;
    text-transform: uppercase;
    color: #2b2f33;
    transition: color ease-in-out 200ms, border ease-in-out 200ms;
  }

  ${({ active }) =>
    active &&
    css`
      a {
        color: #ef50ae;
        border-bottom-color: #ef50ae;
      }
    `}
`;

export const Nav = styled.ul`
  position: absolute;
  left: 20px;
  bottom: 6px;
  height: 25px;

  &:hover ${NavItem} a {
    color: #2b2f33;
    border-bottom-color: transparent;

    &:hover {
      color: #ef50ae;
      border-bottom-color: #ef50ae;

      &:active {
        color: #5783d8;
        border-bottom-color: #5783d8;
      }
    }
  }
`;

export const User = styled.ul`
  position: absolute;
  top: 20px;
  right: 25px;
  font-weight: 500;
  font-size: 0.9em;

  div {
    display: inline-block;
    border: 2px solid #e6ecf1;
    cursor: pointer;
    background: #fff;
    border-radius: 5px;
    padding: 6px 12px;
    text-align: right;
    transition: max-height ease-in-out 200ms;
    max-height: 40px;
    overflow: hidden;

    &:hover {
      max-height: 100px;

      a {
        display: block;
      }
    }

    a {
      display: none;
      border: 0;
      color: rgba(43, 47, 51, 0.5);
      padding: 5px;
      margin: 0 -5px -5px;

      &:hover {
        color: #ef50ae;

        &:active {
          color: #5783d8;
        }
      }
    }
  }

  span {
    font-size: 0.9em;
    margin-left: 10px;
  }
`;
