import { Alert, FlatList, TextInput } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';

import { AppError } from '@utils/AppError';

import { PlayerStorageDTO } from '@storage/player/PlayerStorageDTO';
import { playerAddByGroup } from '@storage/player/playerAddByGroup';
import { playersGetByGroupAndTeam } from '@storage/player/PlayersGetByGroupAndTeam';
import { playerRemoveByGroup } from '@storage/player/playerRemoveByGroup';
import { groupRemoveByName } from '@storage/group/groupRemoveByName';

import { Header } from "@components/Header";
import { ButtonIcon } from "@components/ButtonIcon";
import { Highlight } from "@components/Highlight";
import { Input } from "@components/Input";
import { Filter } from "@components/Filter";
import { PlayerCard } from '@components/PlayerCard';
import { ListEmpty } from '@components/ListEmpty';
import { Button } from '@components/Button';

import { Container, Form, HeaderList, NumberOfPlayers } from "./styles";
import { Loading } from '@components/Loading';

type RouteParams = {
  group: string;
}

export function Players() {
  const [isLoading, setIsLoading] = useState(true);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [team, setTeam] = useState('Time A');
  const [players, setPlayers] = useState<PlayerStorageDTO[]>([]);

  const navigation = useNavigation();
  const route = useRoute();
  const { group } = route.params as RouteParams;

  const newPlayerNameInputRef = useRef<TextInput>(null);

  async function handleAddPlayer(){
    if(newPlayerName.trim().length === 0){
      return Alert.alert("Novo player", 'Informe o nome do player apra adicionar')
    }

    const newPlayer = {
      name: newPlayerName,
      team,
    }

    try {
      await playerAddByGroup(newPlayer, group);

      newPlayerNameInputRef.current?.blur();

      setNewPlayerName('');
      fetchPlayersByTeam();
    } catch (error) {
      if(error instanceof AppError){
        Alert.alert("Novo player", error.message)
      }else{
        console.log(error)
        Alert.alert("Novo player", 'Nao foi possivel adicionar')
      }
    }
  }

  async function fetchPlayersByTeam(){
    try {
      setIsLoading(true);
      const playersByTeam = await playersGetByGroupAndTeam(group, team);
      setPlayers(playersByTeam);
    } catch (error) {
      console.log(error);
      Alert.alert("players", 'Nao foi possivel carregar as pessoas do time selecionado')
    }finally{
      setIsLoading(false);
    }
  }

  async function handlePlayerRemove(playerName: string){
    try {
      await playerRemoveByGroup(playerName, group);
      fetchPlayersByTeam();
    } catch (error) {
      console.log(error)
      Alert.alert("Remover player", "Nao foi possivel remover o player")
    }
  }

  async function groupRemove(){
    try {
      await groupRemoveByName(group);
      navigation.navigate('groups');
    } catch (error) {
      console.log(error);
      Alert.alert('Remover grupo', 'Nao foi possivel remover o grupo')
    }
  }

  async function handleGroupRemove(){
    Alert.alert("Remover", 'Deseja remover o grupo?', [
      {text: 'Nao', style: 'cancel'},
      {text: 'Sim', onPress: () => groupRemove()}
    ])
  }

  useEffect(() => {
    fetchPlayersByTeam();
  }, [team])

  return (
    <Container>
      <Header showBackButton />
      <Highlight
        title={group}
        subtitle="Adicione a galera e separe os times"
      />
      <Form>
        <Input
          inputRef={newPlayerNameInputRef}
          placeholder="Nome da pessoa"
          autoCorrect={false}
          onChangeText={setNewPlayerName}
          value={newPlayerName}
          onSubmitEditing={handleAddPlayer}
          returnKeyType="done"
        />
        <ButtonIcon 
          icon="add"
          onPress={handleAddPlayer}
        />
      </Form>
      <HeaderList>
        <FlatList 
          data={['Time A', 'Time B']}
          keyExtractor={item => item}
          horizontal
          renderItem = {({ item }) =>(
            <Filter 
              title={item}
              isActive={item === team}
              onPress={() => setTeam(item)}
            />
          )}
        />
        
        <NumberOfPlayers>
          {players.length}
        </NumberOfPlayers>
      </HeaderList>
      {
        isLoading ? 
        <Loading/> :
        <FlatList 
          data={players}
          keyExtractor={item => item.name}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            {paddingBottom: 100},
            players.length === 0 && {flex: 1}
          ]}
          renderItem={({ item }) => (
            <PlayerCard
              name={item.name}
              onRemove={()=>handlePlayerRemove(item.name)}
            />
          )}
          ListEmptyComponent={() => (
            <ListEmpty
              message="Nao ha pessoas nesse time"
            />
          )}
        />
      }
      
      <Button
        title="Remover turma"
        type='SECONDARY'
        onPress={handleGroupRemove}
      />
    </Container>
  )
}