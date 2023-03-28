import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { login } from '../reducers/loginSlice';
import { styled } from '@mui/material/styles';

const StyledForm = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  '& > *': {
    margin: '8px',
    width: '25ch',
  },
});

const StyledTextField = styled(TextField)({
  marginBottom: '16px',
});

const LoginForm = () => {
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (credentials) => {
    dispatch(login(credentials));
  };

  return (
    <StyledForm onSubmit={handleSubmit(onSubmit)}>
      <StyledTextField
        label="Email"
        type="email"
        id="email"
        {...register('email', { required: true })}
        error={!!errors.email}
        helperText={errors.email ? 'This field is required' : ''}
      />

      <StyledTextField
        label="Password"
        type="password"
        id="password"
        {...register('password', { required: true })}
        error={!!errors.password}
        helperText={errors.password ? 'This field is required' : ''}
      />

      <Button variant="contained" sx={{ width: '25ch' }} type="submit">
        Login
      </Button>
    </StyledForm>
  );
};

export default LoginForm;