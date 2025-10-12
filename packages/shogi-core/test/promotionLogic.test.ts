import { describe, it, expect } from 'vitest';
import {
  enablePromotionPieceType,
  enablePromotionAfterMove,
  isAutomaticPromotion,
  isPromotedPiece,
  getPromotedPieceTypeFromOriginalPieceType,
  getOriginalPieceTypeFromPromotedPieceType,
} from '../src/utils/promotionLogic';
import type { BoardIndex } from '../src/types';

describe('promotionLogic', () => {
  describe('canPieceBePromoted', () => {
    it('王は成れない', () => {
      expect(enablePromotionPieceType('ou')).toBe(false);
    });

    it('金は成れない', () => {
      expect(enablePromotionPieceType('kin')).toBe(false);
    });

    it('飛車は成れる', () => {
      expect(enablePromotionPieceType('hisha')).toBe(true);
    });

    it('角は成れる', () => {
      expect(enablePromotionPieceType('kaku')).toBe(true);
    });

    it('銀は成れる', () => {
      expect(enablePromotionPieceType('gin')).toBe(true);
    });

    it('桂は成れる', () => {
      expect(enablePromotionPieceType('keima')).toBe(true);
    });

    it('香は成れる', () => {
      expect(enablePromotionPieceType('kyou')).toBe(true);
    });

    it('歩は成れる', () => {
      expect(enablePromotionPieceType('fu')).toBe(true);
    });

    it('成り駒（竜王）は成れる', () => {
      expect(enablePromotionPieceType('ryuou')).toBe(true);
    });

    it('成り駒（竜馬）は成れる', () => {
      expect(enablePromotionPieceType('ryuuma')).toBe(true);
    });

    it('成り駒（成銀）は成れる', () => {
      expect(enablePromotionPieceType('narigin')).toBe(true);
    });

    it('成り駒（成桂）は成れる', () => {
      expect(enablePromotionPieceType('narikei')).toBe(true);
    });

    it('成り駒（成香）は成れる', () => {
      expect(enablePromotionPieceType('narikyo')).toBe(true);
    });

    it('成り駒（と金）は成れる', () => {
      expect(enablePromotionPieceType('tokin')).toBe(true);
    });
  });

  describe('canPromoteAfterMove - 先手', () => {
    it('先手が0行目に移動したら成れる', () => {
      const result = enablePromotionAfterMove(
        { row: 1 as BoardIndex, col: 4 as BoardIndex },
        { row: 0 as BoardIndex, col: 4 as BoardIndex },
        'fu',
        true
      );
      expect(result).toBe(true);
    });

    it('先手が2行目に移動したら成れる', () => {
      const result = enablePromotionAfterMove(
        { row: 3 as BoardIndex, col: 4 as BoardIndex },
        { row: 2 as BoardIndex, col: 4 as BoardIndex },
        'fu',
        true
      );
      expect(result).toBe(true);
    });

    it('先手が2行目から3行目に移動したら成れる（移動元が敵陣）', () => {
      const result = enablePromotionAfterMove(
        { row: 2 as BoardIndex, col: 4 as BoardIndex },
        { row: 3 as BoardIndex, col: 4 as BoardIndex },
        'fu',
        true
      );
      expect(result).toBe(true);
    });

    it('先手が3行目から4行目に移動したら成れない', () => {
      const result = enablePromotionAfterMove(
        { row: 3 as BoardIndex, col: 4 as BoardIndex },
        { row: 4 as BoardIndex, col: 4 as BoardIndex },
        'fu',
        true
      );
      expect(result).toBe(false);
    });

    it('先手の王は敵陣でも成れない', () => {
      const result = enablePromotionAfterMove(
        { row: 1 as BoardIndex, col: 4 as BoardIndex },
        { row: 0 as BoardIndex, col: 4 as BoardIndex },
        'ou',
        true
      );
      expect(result).toBe(false);
    });

    it('先手の金は敵陣でも成れない', () => {
      const result = enablePromotionAfterMove(
        { row: 1 as BoardIndex, col: 4 as BoardIndex },
        { row: 0 as BoardIndex, col: 4 as BoardIndex },
        'kin',
        true
      );
      expect(result).toBe(false);
    });

    it('先手の成り駒（竜王）は敵陣で成れる', () => {
      const result = enablePromotionAfterMove(
        { row: 1 as BoardIndex, col: 4 as BoardIndex },
        { row: 0 as BoardIndex, col: 4 as BoardIndex },
        'ryuou',
        true
      );
      expect(result).toBe(true);
    });

    it('先手の成り駒（と金）は敵陣で成れる', () => {
      const result = enablePromotionAfterMove(
        { row: 1 as BoardIndex, col: 4 as BoardIndex },
        { row: 0 as BoardIndex, col: 4 as BoardIndex },
        'tokin',
        true
      );
      expect(result).toBe(true);
    });
  });

  describe('canPromoteAfterMove - 後手', () => {
    it('後手が8行目に移動したら成れる', () => {
      const result = enablePromotionAfterMove(
        { row: 7 as BoardIndex, col: 4 as BoardIndex },
        { row: 8 as BoardIndex, col: 4 as BoardIndex },
        'fu',
        false
      );
      expect(result).toBe(true);
    });

    it('後手が6行目に移動したら成れる', () => {
      const result = enablePromotionAfterMove(
        { row: 5 as BoardIndex, col: 4 as BoardIndex },
        { row: 6 as BoardIndex, col: 4 as BoardIndex },
        'fu',
        false
      );
      expect(result).toBe(true);
    });

    it('後手が6行目から5行目に移動したら成れる（移動元が敵陣）', () => {
      const result = enablePromotionAfterMove(
        { row: 6 as BoardIndex, col: 4 as BoardIndex },
        { row: 5 as BoardIndex, col: 4 as BoardIndex },
        'fu',
        false
      );
      expect(result).toBe(true);
    });

    it('後手が5行目から4行目に移動したら成れない', () => {
      const result = enablePromotionAfterMove(
        { row: 5 as BoardIndex, col: 4 as BoardIndex },
        { row: 4 as BoardIndex, col: 4 as BoardIndex },
        'fu',
        false
      );
      expect(result).toBe(false);
    });

    it('後手の王は敵陣でも成れない', () => {
      const result = enablePromotionAfterMove(
        { row: 7 as BoardIndex, col: 4 as BoardIndex },
        { row: 8 as BoardIndex, col: 4 as BoardIndex },
        'ou',
        false
      );
      expect(result).toBe(false);
    });

    it('後手の金は敵陣でも成れない', () => {
      const result = enablePromotionAfterMove(
        { row: 7 as BoardIndex, col: 4 as BoardIndex },
        { row: 8 as BoardIndex, col: 4 as BoardIndex },
        'kin',
        false
      );
      expect(result).toBe(false);
    });

    it('後手の成り駒（竜馬）は敵陣で成れる', () => {
      const result = enablePromotionAfterMove(
        { row: 7 as BoardIndex, col: 4 as BoardIndex },
        { row: 8 as BoardIndex, col: 4 as BoardIndex },
        'ryuuma',
        false
      );
      expect(result).toBe(true);
    });

    it('後手の成り駒（成銀）は敵陣で成れる', () => {
      const result = enablePromotionAfterMove(
        { row: 7 as BoardIndex, col: 4 as BoardIndex },
        { row: 8 as BoardIndex, col: 4 as BoardIndex },
        'narigin',
        false
      );
      expect(result).toBe(true);
    });
  });

  describe('mustPromote - 先手', () => {
    it('先手の歩が0行目に移動したら必ず成る', () => {
      const result = isAutomaticPromotion(
        { row: 0 as BoardIndex, col: 4 as BoardIndex },
        'fu',
        true
      );
      expect(result).toBe(true);
    });

    it('先手の香が0行目に移動したら必ず成る', () => {
      const result = isAutomaticPromotion(
        { row: 0 as BoardIndex, col: 4 as BoardIndex },
        'kyou',
        true
      );
      expect(result).toBe(true);
    });

    it('先手の桂が0行目に移動したら必ず成る', () => {
      const result = isAutomaticPromotion(
        { row: 0 as BoardIndex, col: 4 as BoardIndex },
        'keima',
        true
      );
      expect(result).toBe(true);
    });

    it('先手の桂が1行目に移動したら必ず成る', () => {
      const result = isAutomaticPromotion(
        { row: 1 as BoardIndex, col: 4 as BoardIndex },
        'keima',
        true
      );
      expect(result).toBe(true);
    });

    it('先手の歩が1行目に移動したら成らなくても良い', () => {
      const result = isAutomaticPromotion(
        { row: 1 as BoardIndex, col: 4 as BoardIndex },
        'fu',
        true
      );
      expect(result).toBe(false);
    });

    it('先手の桂が2行目に移動したら成らなくても良い', () => {
      const result = isAutomaticPromotion(
        { row: 2 as BoardIndex, col: 4 as BoardIndex },
        'keima',
        true
      );
      expect(result).toBe(false);
    });

    it('先手の銀が0行目に移動したら成らなくても良い', () => {
      const result = isAutomaticPromotion(
        { row: 0 as BoardIndex, col: 4 as BoardIndex },
        'gin',
        true
      );
      expect(result).toBe(false);
    });

    it('先手の成り駒（竜王）が0行目に移動しても自動的に成らない', () => {
      const result = isAutomaticPromotion(
        { row: 0 as BoardIndex, col: 4 as BoardIndex },
        'ryuou',
        true
      );
      expect(result).toBe(false);
    });

    it('先手の成り駒（と金）が0行目に移動しても自動的に成らない', () => {
      const result = isAutomaticPromotion(
        { row: 0 as BoardIndex, col: 4 as BoardIndex },
        'tokin',
        true
      );
      expect(result).toBe(false);
    });

    it('先手の成り駒（成桂）が1行目に移動しても自動的に成らない', () => {
      const result = isAutomaticPromotion(
        { row: 1 as BoardIndex, col: 4 as BoardIndex },
        'narikei',
        true
      );
      expect(result).toBe(false);
    });
  });

  describe('mustPromote - 後手', () => {
    it('後手の歩が8行目に移動したら必ず成る', () => {
      const result = isAutomaticPromotion(
        { row: 8 as BoardIndex, col: 4 as BoardIndex },
        'fu',
        false
      );
      expect(result).toBe(true);
    });

    it('後手の香が8行目に移動したら必ず成る', () => {
      const result = isAutomaticPromotion(
        { row: 8 as BoardIndex, col: 4 as BoardIndex },
        'kyou',
        false
      );
      expect(result).toBe(true);
    });

    it('後手の桂が8行目に移動したら必ず成る', () => {
      const result = isAutomaticPromotion(
        { row: 8 as BoardIndex, col: 4 as BoardIndex },
        'keima',
        false
      );
      expect(result).toBe(true);
    });

    it('後手の桂が7行目に移動したら必ず成る', () => {
      const result = isAutomaticPromotion(
        { row: 7 as BoardIndex, col: 4 as BoardIndex },
        'keima',
        false
      );
      expect(result).toBe(true);
    });

    it('後手の歩が7行目に移動したら成らなくても良い', () => {
      const result = isAutomaticPromotion(
        { row: 7 as BoardIndex, col: 4 as BoardIndex },
        'fu',
        false
      );
      expect(result).toBe(false);
    });

    it('後手の桂が6行目に移動したら成らなくても良い', () => {
      const result = isAutomaticPromotion(
        { row: 6 as BoardIndex, col: 4 as BoardIndex },
        'keima',
        false
      );
      expect(result).toBe(false);
    });

    it('後手の銀が8行目に移動したら成らなくても良い', () => {
      const result = isAutomaticPromotion(
        { row: 8 as BoardIndex, col: 4 as BoardIndex },
        'gin',
        false
      );
      expect(result).toBe(false);
    });

    it('後手の成り駒（竜馬）が8行目に移動しても自動的に成らない', () => {
      const result = isAutomaticPromotion(
        { row: 8 as BoardIndex, col: 4 as BoardIndex },
        'ryuuma',
        false
      );
      expect(result).toBe(false);
    });

    it('後手の成り駒（成香）が8行目に移動しても自動的に成らない', () => {
      const result = isAutomaticPromotion(
        { row: 8 as BoardIndex, col: 4 as BoardIndex },
        'narikyo',
        false
      );
      expect(result).toBe(false);
    });

    it('後手の成り駒（成桂）が7行目に移動しても自動的に成らない', () => {
      const result = isAutomaticPromotion(
        { row: 7 as BoardIndex, col: 4 as BoardIndex },
        'narikei',
        false
      );
      expect(result).toBe(false);
    });
  });

  describe('isPromotedPiece', () => {
    it('竜王は成り駒', () => {
      expect(isPromotedPiece('ryuou')).toBe(true);
    });

    it('竜馬は成り駒', () => {
      expect(isPromotedPiece('ryuuma')).toBe(true);
    });

    it('成銀は成り駒', () => {
      expect(isPromotedPiece('narigin')).toBe(true);
    });

    it('成桂は成り駒', () => {
      expect(isPromotedPiece('narikei')).toBe(true);
    });

    it('成香は成り駒', () => {
      expect(isPromotedPiece('narikyo')).toBe(true);
    });

    it('と金は成り駒', () => {
      expect(isPromotedPiece('tokin')).toBe(true);
    });

    it('飛車は成り駒ではない', () => {
      expect(isPromotedPiece('hisha')).toBe(false);
    });

    it('角は成り駒ではない', () => {
      expect(isPromotedPiece('kaku')).toBe(false);
    });

    it('王は成り駒ではない', () => {
      expect(isPromotedPiece('ou')).toBe(false);
    });
  });

  describe('getPromotedPieceTypeFromOriginalPieceType', () => {
    it('飛車は竜王に成る', () => {
      expect(getPromotedPieceTypeFromOriginalPieceType('hisha')).toBe('ryuou');
    });

    it('角は竜馬に成る', () => {
      expect(getPromotedPieceTypeFromOriginalPieceType('kaku')).toBe('ryuuma');
    });

    it('銀は成銀に成る', () => {
      expect(getPromotedPieceTypeFromOriginalPieceType('gin')).toBe('narigin');
    });

    it('桂は成桂に成る', () => {
      expect(getPromotedPieceTypeFromOriginalPieceType('keima')).toBe(
        'narikei'
      );
    });

    it('香は成香に成る', () => {
      expect(getPromotedPieceTypeFromOriginalPieceType('kyou')).toBe('narikyo');
    });

    it('歩はと金に成る', () => {
      expect(getPromotedPieceTypeFromOriginalPieceType('fu')).toBe('tokin');
    });

    it('王は成れない（nullを返す）', () => {
      expect(getPromotedPieceTypeFromOriginalPieceType('ou')).toBe(null);
    });

    it('金は成れない（nullを返す）', () => {
      expect(getPromotedPieceTypeFromOriginalPieceType('kin')).toBe(null);
    });
  });

  describe('getOriginalPieceTypeFromPromotedPieceType', () => {
    it('竜王は飛車に戻る', () => {
      expect(getOriginalPieceTypeFromPromotedPieceType('ryuou')).toBe('hisha');
    });

    it('竜馬は角に戻る', () => {
      expect(getOriginalPieceTypeFromPromotedPieceType('ryuuma')).toBe('kaku');
    });

    it('成銀は銀に戻る', () => {
      expect(getOriginalPieceTypeFromPromotedPieceType('narigin')).toBe('gin');
    });

    it('成桂は桂に戻る', () => {
      expect(getOriginalPieceTypeFromPromotedPieceType('narikei')).toBe(
        'keima'
      );
    });

    it('成香は香に戻る', () => {
      expect(getOriginalPieceTypeFromPromotedPieceType('narikyo')).toBe('kyou');
    });

    it('と金は歩に戻る', () => {
      expect(getOriginalPieceTypeFromPromotedPieceType('tokin')).toBe('fu');
    });

    it('成り駒でない駒はそのまま返す', () => {
      expect(getOriginalPieceTypeFromPromotedPieceType('ou')).toBe('ou');
      expect(getOriginalPieceTypeFromPromotedPieceType('kin')).toBe('kin');
      expect(getOriginalPieceTypeFromPromotedPieceType('hisha')).toBe('hisha');
    });
  });
});
