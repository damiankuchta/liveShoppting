import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { TextField, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { register } from '../reducers/registerSlce';

const Form = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  '& > *': {
    margin: '8px',
    width: '25ch',
  },
});

const RegisterForm = () => {
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (formData) => {
    dispatch(register(formData));
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        label="Name"
        type="text"
        id="name"
        {...register('name', { required: true })}
        error={!!errors.name}
        helperText={errors.name ? 'This field is required' : ''}
      />

      <TextField
        label="Email"
        type="email"
        id="email"
        {...register('email', { required: true })}
        error={!!errors.email}
        helperText={errors.email ? 'This field is required' : ''}
      />

      <TextField
        label="Password"
        type="password"
        id="password"
        {...register('password', { required: true })}
        error={!!errors.password}
        helperText={errors.password ? 'This field is required' : ''}
      />

      <Button
        variant="contained"
        color="primary"
        sx={{ margin: '16px 0' }}
        type="submit"
      >
        Register
      </Button>
    </Form>
  );
};

export default RegisterForm;