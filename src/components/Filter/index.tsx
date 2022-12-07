import { TouchableOpacityProps } from 'react-native'
import { Container, Title, FilterStleProps } from './styles'

type Props = TouchableOpacityProps & FilterStleProps & {
  title: string;
}

export function Filter({ title, isActive = false, ...rest }: Props) {
  return (
    <Container 
      isActive={isActive}
      {...rest}
    >
      <Title>{title}</Title>
    </Container>
  );
}